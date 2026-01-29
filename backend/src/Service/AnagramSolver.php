<?php

namespace App\Service;

class AnagramSolver
{
    /**
     * Takes a word and returns its alphabetically sorted key.
     * Example: "tere" -> "eert"
     */
    public function computeSortedKey(string $word): string
    {
        $cleanWord = trim($word);
        if (empty($cleanWord)) {
            return '';
        }
        $parts = mb_str_split(mb_strtolower($cleanWord));
        sort($parts);
        return implode('', $parts);
    }
}