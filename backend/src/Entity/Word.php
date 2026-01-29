<?php

namespace App\Entity;

use App\Repository\WordRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: WordRepository::class)]
class Word
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $originalWord = null;

    #[ORM\Column(length: 255)]
    private ?string $sortedWord = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getOriginalWord(): ?string
    {
        return $this->originalWord;
    }

    public function setOriginalWord(string $originalWord): static
    {
        $this->originalWord = $originalWord;

        return $this;
    }

    public function getSortedWord(): ?string
    {
        return $this->sortedWord;
    }

    public function setSortedWord(string $sortedWord): static
    {
        $this->sortedWord = $sortedWord;

        return $this;
    }
}
