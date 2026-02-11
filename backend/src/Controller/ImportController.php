<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\Word;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\HttpKernel\Profiler\Profiler;
use OpenApi\Attributes as OA;
use App\Service\AnagramSolver;

final class ImportController extends AbstractController
{
    #[Route('/api/import', name: 'app_import', methods: ['POST'])]
    #[OA\RequestBody(
        description: 'URL to the wordbase text file',
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'url', type: 'string', example: 'https://www.opus.ee/lemmad2013.txt')
            ]
        )
    )]
    #[OA\Response(
        response: 200, 
        description: 'Import successful',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'message', type: 'string'),
                new OA\Property(property: 'words_imported', type: 'integer'),
                new OA\Property(property: 'source', type: 'string')
            ]
        )
    )]
    #[OA\Tag(name: 'Import')]
    public function index(Request $request, HttpClientInterface $client, EntityManagerInterface $em, AnagramSolver $solver, ?Profiler $profiler = null): JsonResponse
    {
        if ($profiler) {
            $profiler->disable();
        }

        set_time_limit(0);
        ini_set('memory_limit', '-1');
        $em->getConnection()->getConfiguration()->setMiddlewares([]);

        $data = json_decode($request->getContent(), true);
        $targetUrl = $data['url'] ?? null;
        if (empty($targetUrl)) {
            return $this->json(['error_code' => 'MISSING_URL'], 400);
        }
        $targetUrl = str_replace(['http(s)://', 'HTTP(S)://'], 'https://', $targetUrl);
        if ($targetUrl && !preg_match('/^https?:\/\//', $targetUrl)) {
            $targetUrl = 'https://' . $targetUrl;
        }

        try {
            if (empty($targetUrl)) {
                 return $this->json(['error_code' => 'MISSING_URL'], 400);
            }
            $response = $client->request('GET', $targetUrl);
            if ($response->getStatusCode() !== 200) {
                 return $this->json(['error_code' => 'REMOTE_ERROR', 'details' => $response->getStatusCode()], 400);
            }
            $contentType = $response->getHeaders()['content-type'][0] ?? '';
            if (str_contains($contentType, 'text/html')) {
                return $this->json(['error_code' => 'INVALID_CONTENT_TYPE'], 400);
            }
            $content = $response->getContent();
            if (empty($content)) {
                 return $this->json(['error_code' => 'FILE_EMPTY'], 400);
            }
        } catch (\Exception $e) {
            $msg = $e->getMessage();
            $code = 'IMPORT_FAILED';

            if (str_contains($msg, 'scheme is missing')) {
                $code = 'INVALID_SCHEME';
            } 
            return $this->json([
                'error' => $msg, 
                'error_code' => $code
            ], 400);
        }

        $connection = $em->getConnection();
        $connection->executeStatement('TRUNCATE TABLE word RESTART IDENTITY');

        $words = explode("\n", $content);
        $count = 0;
        $batchSize = 500; 

        foreach ($words as $rawWord) {
            $cleanWord = trim($rawWord);
            if (empty($cleanWord)) continue;
            $word = new Word();
            $word->setOriginalWord($cleanWord);
            $word->setSortedWord($solver->computeSortedKey($cleanWord));
            $em->persist($word);
            if (($count % $batchSize) === 0) {
                $em->flush();
                $em->clear(); 
            }
            $count++;
        }

        $em->flush();
        $em->clear(); 

        return $this->json([
            'message' => 'Import successful!',
            'words_imported' => $count,
            'source' => $targetUrl
        ]);
    }
}