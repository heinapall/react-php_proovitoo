<?php

namespace App\Tests\Service;

use App\Service\AnagramSolver;
use PHPUnit\Framework\TestCase;

class AnagramSolverTest extends TestCase
{
    private AnagramSolver $solver;

    protected function setUp(): void
    {
        $this->solver = new AnagramSolver();
    }

    public function testComputeSortedKey(): void
    {
        $this->assertEquals('eert', $this->solver->computeSortedKey('tere'));

        $this->assertEquals('eert', $this->solver->computeSortedKey('Tere'));

        $this->assertEquals('eert', $this->solver->computeSortedKey('  tere  '));

        $key1 = $this->solver->computeSortedKey('listen');
        $key2 = $this->solver->computeSortedKey('silent');
        $this->assertEquals($key1, $key2);

        $this->assertEquals('', $this->solver->computeSortedKey(''));
    }
}