<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\Word;
use Doctrine\ORM\EntityManagerInterface;
use OpenApi\Attributes as OA;
use Nelmio\ApiDocBundle\Annotation\Model;
use App\Service\AnagramSolver;

#[Route('/api', name: 'api_')]
final class SearchController extends AbstractController
{
    #[Route('/anagrams/{word}', name: 'search_anagrams', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: 'Returns a list of anagrams and whether the word exists',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'searched_for', type: 'string', example: 'tere'),
                new OA\Property(property: 'word_exists', type: 'boolean', example: true),
                new OA\Property(
                    property: 'anagrams', 
                    type: 'array', 
                    items: new OA\Items(type: 'string', example: 'reet')
                )
            ]
        )
    )]
    #[OA\Tag(name: 'Anagrams')]
    public function search(string $word, EntityManagerInterface $em, AnagramSolver $solver): JsonResponse
    {
        $cleanWord = trim($word);
        
        if (empty($cleanWord)) {
            return $this->json(['anagrams' => [], 'word_exists' => false]);
        }

        $searchKey = $solver->computeSortedKey($cleanWord);
        $repository = $em->getRepository(Word::class);

        $exactMatch = $repository->findOneBy(['originalWord' => $cleanWord]);
        $wordExists = ($exactMatch !== null);

        $matches = $repository->findBy(['sortedWord' => $searchKey]);

        $results = [];
        foreach ($matches as $match) {
            if ($match->getOriginalWord() !== $cleanWord) {
                $results[] = $match->getOriginalWord();
            }
        }

        return $this->json([
            'searched_for' => $cleanWord,
            'word_exists' => $wordExists,
            'anagrams' => $results
        ]);
    }
}