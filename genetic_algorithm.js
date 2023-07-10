// Genetic Algorithm Parameters
const POPULATION_SIZE = 100;
const MAX_GENERATIONS = 100;
const MUTATION_RATE = 0.01;
const MIN_X = -15;
const MAX_X = 15;

// Function to Optimize
function fitnessFunction(x) {
    return x * x * x + 7 * x * x - 4 * x + 3;
}

// Generate Random Number within a Range
function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

// Individual Representation
class Individual {
    constructor() {
      this.x = randomInRange(MIN_X, MAX_X); // Initialize with random value within the given range
      this.fitness = fitnessFunction(this.x);
    }
}

// Generate Initial Population
function generateInitialPopulation() {
  const population = [];
  for (let i = 0; i < POPULATION_SIZE; i++) {
    population.push(new Individual());
  }
  return population;
}

// Roulette Wheel Selection
function rouletteWheelSelection(population) {
  const totalFitness = population.reduce((sum, individual) => sum + individual.fitness, 0);
  let cumulativeFitness = 0;
  const randomValue = Math.random() * totalFitness;
  for (let i = 0; i < population.length; i++) {
    cumulativeFitness += population[i].fitness;
    if (cumulativeFitness >= randomValue) {
      return population[i];
    }
  }
}

// Crossover (Single-Point)
function crossover(parent1, parent2) {
  const offspring = new Individual();
  const crossoverPoint = Math.floor(Math.random() * (String(parent1.x).length - 1)) + 1;
  const parent1Binary = String(parent1.x).split('');
  const parent2Binary = String(parent2.x).split('');
  const offspringBinary = parent1Binary.slice(0, crossoverPoint).concat(parent2Binary.slice(crossoverPoint));
  offspring.x = parseFloat(offspringBinary.join(''));
  return offspring;
}

// Mutation
function mutate(individual) {
  const individualBinary = String(individual.x).split('');
  for (let i = 0; i < individualBinary.length; i++) {
    if (Math.random() < MUTATION_RATE) {
      individualBinary[i] = individualBinary[i] === '0' ? '1' : '0';
    }
  }
  individual.x = parseFloat(individualBinary.join(''));
  individual.fitness = fitnessFunction(individual.x);
}

// Genetic Algorithm
function geneticAlgorithm() {
  let population = generateInitialPopulation();
  let generation = 0;

  while (generation < MAX_GENERATIONS) {
    const offspringPopulation = [];

    for (let i = 0; i < POPULATION_SIZE; i++) {
      const parent1 = rouletteWheelSelection(population);
      const parent2 = rouletteWheelSelection(population);
      const offspring = crossover(parent1, parent2);
      mutate(offspring);
      offspringPopulation.push(offspring);
    }

    population = offspringPopulation;
    generation++;
  }

  // Find the best individual in the final population
  let bestIndividual = population[0];
  for (let i = 1; i < POPULATION_SIZE; i++) {
    if (population[i].fitness > bestIndividual.fitness) {
      bestIndividual = population[i];
    }
  }

  return bestIndividual;
}

// Run the Genetic Algorithm
const bestSolution = geneticAlgorithm();
console.log('Best Solution:', bestSolution.x);
console.log('Fitness:', bestSolution.fitness);
