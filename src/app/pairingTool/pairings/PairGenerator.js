
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

const canBeIncluded = (candidatePair, solution) => solution.every(pair => pair.student !== candidatePair.student && pair.coach !== candidatePair.coach)

const generateFrom = (preferedSolution, secondarySolution) => {
  preferedSolution.concat(secondarySolution.filter(pair => canBeIncluded(pair, preferedSolution)))
  const assignedStudents = []
  const assignedCoaches = []

  preferedSolution.forEach(pair => {
    assignedStudents.push(pair.student)
    assignedCoaches.push(pair.coach)
  })

  const remainingStudents = preferedSolution.map(pair => pair.student).filter(student => assignedStudents.includes(student))
  const remainingCoaches = preferedSolution.map(pair => pair.coach).filter(coach => assignedCoaches.includes(coach))

  return preferedSolution.concat(assignRandomly(remainingStudents, remainingCoaches))
}

const something = (solutionA, solutionB) => {
  const eliteFromA = solutionA.sort(pairFitness).slice(0, 4)
  const eliteFromB = solutionB.sort(pairFitness).slice(0, 4)

  return [generateFrom(eliteFromA, eliteFromB), generateFrom(eliteFromB, eliteFromA)]
}

const crossover = solutions => {
  const nextGeneration = []
  for(let i = 0; i < solutions.length; i +=2) {
    const solutionA = solutions[i]
    const solutionB = solutions[i+1]
    const [childA, childB] = something(solutionA, solutionB)
    nextGeneration.push(childA)
    nextGeneration.push(childB)
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

  for(let i = 0; i < GENERATIONS_LIMIT; i++) {
    const sortedSolutions = selection(solutions)
    const eliteSolutions = sortedSolutions.splice(0, 4)
    solutions = eliteSolutions.concat(crossover(sortedSolutions))
  }

  return selection(solutions)[0]
}

const generator = {
  generate
}

export default generator
