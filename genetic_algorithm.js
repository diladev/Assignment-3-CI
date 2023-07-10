// Genetic Algorithm Parameters
const POPULATION_SIZE = 100;
const MAX_GENERATIONS = 100;
const MUTATION_RATE = 0.01;
const MAX_WEIGHT = 15;

// Item Definition
class Item {
  constructor(weight, value) {
    this.weight = weight;
    this.value = value;
  }
}

// Knapsack Problem Setup
const items = [
  new Item(2, 12),
  new Item(4, 10),
  new Item(6, 15),
  new Item(2, 7),
  new Item(3, 8),
  new Item(5, 11)
];
const numItems = items.length;

// Individual Representation
class Individual {
  constructor() {
    this.genes = [];
    for (let i = 0; i < numItems; i++) {
      this.genes[i] = Math.random() < 0.5 ? 0 : 1; // Initialize with random binary genes
    }
    this.fitness = this.calculateFitness();
  }

  calculateFitness() {
    let totalWeight = 0;
    let totalValue = 0;
    for (let i = 0; i < numItems; i++) {
      if (this.genes[i] === 1) {
        totalWeight += items[i].weight;
        totalValue += items[i].value;
      }
    }
    return (totalWeight <= MAX_WEIGHT) ? totalValue : 0;
  }
}

// Generate Random Number within a Range
function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
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
  const crossoverPoint = Math.floor(Math.random() * (parent1.genes.length - 1)) + 1;
  offspring.genes = parent1.genes.slice(0, crossoverPoint).concat(parent2.genes.slice(crossoverPoint));
  return offspring;
}

// Mutation
function mutate(individual) {
  for (let i = 0; i < individual.genes.length; i++) {
    if (Math.random() < MUTATION_RATE) {
      individual.genes[i] = individual.genes[i] === 0 ? 1 : 0;
    }
  }
  individual.fitness = individual.calculateFitness();
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
console.log('Best Solution (Gene Representation):', bestSolution.genes);
console.log('Best Solution (Items Selected):');
for (let i = 0; i < numItems; i++) {
  if (bestSolution.genes[i] === 1) {
    console.log('Item', i + 1, ': Weight', items[i].weight, ', Value', items[i].value);
  }
}
console.log('Fitness:', bestSolution.fitness);
