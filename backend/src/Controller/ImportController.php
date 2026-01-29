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
            return $this->json(['error' => 'No URL provided.'], 400);
        }

        try {
            $response = $client->request('GET', $targetUrl);
            if ($response->getStatusCode() !== 200) {
                throw new \Exception("Remote server returned error " . $response->getStatusCode());
            }
            $content = $response->getContent();
            if (empty($content)) {
                throw new \Exception("File is empty.");
            }
        } catch (\Exception $e) {
            return $this->json(['error' => 'Import failed: ' . $e->getMessage()], 400);
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