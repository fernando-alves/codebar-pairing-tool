
const POPULATION_SIZE = 42

const GENERATIONS_LIMIT = 50

const assignRandomly = (students, coaches) => students.map(student => {
  const randomCoachIndex = Math.floor(Math.random() * coaches.length)
  const randomCoach = coaches[randomCoachIndex]
  coaches.splice(randomCoachIndex, 1)

  return {student, coach: randomCoach}
})

const fitness = solution => solution.filter(pair => pairFitness(pair) >= 0).length

const pairFitness = pair => pair.student.languages.some(language => pair.coach.languages.includes(language)) ? 1 : 0

const crossover = (solutions, students, coaches) => {
  const nextGeneration = []
  for(let i = 0; i < solutions.length; i +=2) {
    const solutionA = solutions[i]
    const solutionB = solutions[i+1]
    const betterSolution = selection([solutionA, solutionB])[0]
    nextGeneration.push(betterSolution)
    nextGeneration.push(assignRandomly(students, [...coaches]))
  }

  return nextGeneration
}

const selection = solutions => solutions.sort(solution => -fitness(solution))

const generateInitialPopulation = (students, coaches) => {
  const solutions = []
  for(let i = 0; i < POPULATION_SIZE; i++) {
    solutions[i] = assignRandomly(students, [...coaches])
  }

  return solutions
}

const generate = (students, coaches) => {
  let solutions = generateInitialPopulation(students, coaches)
  console.log('initial solutions', solutions)

  for(let i = 0; i < GENERATIONS_LIMIT; i++) {
    const sortedSolutions = selection(solutions)
    const eliteSolutions = sortedSolutions.splice(0, 4)
    solutions = eliteSolutions.concat(crossover(sortedSolutions, students, coaches))
    console.log('new solutions', solutions)
  }

  return selection(solutions)[0]
}

const generator = {
  generate
}

export default generator
