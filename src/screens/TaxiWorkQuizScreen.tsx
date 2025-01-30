import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  Pressable,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  Title,
  Paragraph,
  ProgressBar,
  RadioButton,
  Icon,
} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

const QUIZZES = [
  {
    title: 'Taxi Work and Challenges',
    icon: 'taxi',
    questions: [
      {
        question:
          'How many kilometers does a taxi driver typically drive in a day?',
        options: ['50-100 km', '100-200 km', '200-300 km', '300-500 km'],
        correctAnswer: '200-300 km',
        explanation:
          'Most urban taxi drivers cover approximately 250 km during a workday.',
      },
      {
        question: 'What is the average daily income of a taxi driver?',
        options: [
          '200-500',
          '500-1000',
          '1000-1500',
          '1500-2000',
        ],
        correctAnswer: '1000-1500',
        explanation:
          'Depending on the city and workload, a taxi driver earns approximately 1200 per day.',
      },
      {
        question: 'What is the best way to navigate peak traffic hours?',
        options: [
          'Avoid main roads',
          'Use traffic apps',
          'Drive early mornings',
          'All of the above',
        ],
        correctAnswer: 'All of the above',
        explanation:
          'Using traffic apps and planning routes in advance can significantly reduce delays during peak hours.',
      },
      {
        question: 'What is the most common cause of vehicle breakdowns?',
        options: [
          'Flat tires',
          'Engine overheating',
          'Battery issues',
          'Transmission failure',
        ],
        correctAnswer: 'Battery issues',
        explanation:
          'Battery issues are the most frequent cause of breakdowns, especially in cold weather.',
      },
      {
        question: 'What should you check before starting a shift?',
        options: [
          'Tire pressure',
          'Fuel level',
          'Vehicle cleanliness',
          'All of the above',
        ],
        correctAnswer: 'All of the above',
        explanation:
          'Ensuring your vehicle is in top condition is crucial for a smooth day on the road.',
      },
    ],
  },
  {
    title: 'City Facts and Figures',
    icon: 'city',
    questions: [
      {
        question: 'What is the average population of a large city?',
        options: ['100-250k', '250-500k', '500-750k', '750-1000k'],
        correctAnswer: '500-750k',
        explanation: 'An average large city has around 600,000 residents.',
      },
      {
        question:
          'How many cars are there per 1000 residents in a modern city?',
        options: [
          '100-200 cars',
          '200-300 cars',
          '300-400 cars',
          '400-500 cars',
        ],
        correctAnswer: '300-400 cars',
        explanation:
          'Typically, there are around 350 cars per 1000 residents in a modern city.',
      },
      {
        question: 'What percentage of people use public transport daily?',
        options: ['10-20%', '20-30%', '30-40%', '40-50%'],
        correctAnswer: '30-40%',
        explanation:
          'In most large cities, around 35% of people rely on public transport for their daily commute.',
      },
      {
        question: 'What is the average age of city infrastructure?',
        options: ['10-20 years', '20-30 years', '30-50 years', '50+ years'],
        correctAnswer: '30-50 years',
        explanation:
          'The average age of infrastructure in large cities is often between 30 and 50 years.',
      },
    ],
  },
  {
    title: 'City Transportation',
    icon: 'bus',
    questions: [
      {
        question:
          'How many types of public transport are there in a typical city?',
        options: ['2-3 types', '3-4 types', '4-5 types', '5-6 types'],
        correctAnswer: '4-5 types',
        explanation:
          'Most cities have buses, trams, trolleys, and metro systems.',
      },
      {
        question: 'What is the average cost of a single public transport ride?',
        options: ['10-15', '15-20', '20-25', '25-30'],
        correctAnswer: '15-20',
        explanation: 'The average cost of a single ride is around 18.',
      },
      {
        question: 'What is the most eco-friendly form of public transport?',
        options: ['Buses', 'Trams', 'Metro', 'Electric scooters'],
        correctAnswer: 'Metro',
        explanation:
          'The metro is considered one of the most eco-friendly transport systems due to its efficiency and low emissions.',
      },
      {
        question: 'What is the peak time for public transport usage?',
        options: ['6-8 AM', '8-10 AM', '5-7 PM', 'All of the above'],
        correctAnswer: 'All of the above',
        explanation:
          'Peak usage typically occurs during morning and evening rush hours.',
      },
    ],
  },
  {
    title: 'Road Safety Tips',
    icon: 'road',
    questions: [
      {
        question: 'What is the safest speed limit in urban areas?',
        options: ['30 km/h', '50 km/h', '70 km/h', '90 km/h'],
        correctAnswer: '50 km/h',
        explanation:
          'The recommended speed limit in urban areas is 50 km/h to reduce the risk of accidents.',
      },
      {
        question: 'What should you always carry in your car?',
        options: [
          'First aid kit',
          'Spare tire',
          'Emergency triangle',
          'All of the above',
        ],
        correctAnswer: 'All of the above',
        explanation:
          'Carrying safety equipment ensures you are prepared for emergencies.',
      },
      {
        question: 'What should you do if your car skids on a wet road?',
        options: [
          'Brake hard',
          'Steer into the skid',
          'Accelerate quickly',
          'Do nothing',
        ],
        correctAnswer: 'Steer into the skid',
        explanation:
          'Steering into the skid helps you regain control of the vehicle on slippery roads.',
      },
    ],
  },
];

export const TaxiWorkQuizScreen = () => {
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);

  const handleQuizSelection = (index: number) => {
    setSelectedQuiz(index);
    resetQuizState();
  };

  const resetQuizState = () => {
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setScore(0);
    setQuizCompleted(false);
    setUserAnswers([]);
  };

  const handleAnswer = () => {
    const currentQuiz = QUIZZES[selectedQuiz!];
    const isCorrect =
      selectedAnswer === currentQuiz.questions[currentQuestion].correctAnswer;

    setUserAnswers([...userAnswers, selectedAnswer]);

    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < currentQuiz.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
    } else {
      setQuizCompleted(true);
    }
  };

  const RenderQuizSelection = () => (
    <LinearGradient colors={['#4e54c8', '#8f94fb']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.quizSelectionContainer}>
        <Title style={styles.mainTitle}>Choose a Quiz</Title>
        {QUIZZES.map((quiz, index) => (
          <Card
            key={index}
            style={styles.quizCard}
            onPress={() => handleQuizSelection(index)}>
            <Card.Content style={styles.quizCardContent}>
              <Icon source={quiz.icon} size={40} color="#4e54c8" />
              <Text style={styles.quizCardTitle}>{quiz.title}</Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </LinearGradient>
  );

  const RenderQuiz = () => {
    const currentQuiz = QUIZZES[selectedQuiz!];
    const currentQuizQuestions = currentQuiz.questions;

    if (quizCompleted) {
      return (
        <LinearGradient
          colors={['#4e54c8', '#8f94fb']}
          style={styles.container}>
          <ScrollView contentContainerStyle={styles.resultContainer}>
            <Card style={styles.resultCard}>
              <Card.Content>
                <Title style={styles.resultTitle}>
                  {currentQuiz.title}: Results
                </Title>

                <View style={styles.statSection}>
                  <View style={styles.statItem}>
                    <Icon source="star" size={24} color="#ffd700" />
                    <Text style={styles.statLabel}>
                      Score: {score} out of {currentQuizQuestions.length}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Icon source="percent" size={24} color="#4caf50" />
                    <Text style={styles.statLabel}>
                      Accuracy:{' '}
                      {((score / currentQuizQuestions.length) * 100).toFixed(0)}
                      %
                    </Text>
                  </View>
                </View>

                <Title style={styles.detailsTitle}>Answer Details</Title>
                {currentQuizQuestions.map((q, index) => (
                  <Card key={index} style={styles.questionResultCard}>
                    <Card.Content>
                      <Text style={styles.questionText}>{q.question}</Text>
                      <View style={styles.answerRow}>
                        <Text style={styles.userAnswerLabel}>
                          Your Answer:{' '}
                        </Text>
                        <Text style={styles.userAnswer}>
                          {userAnswers[index]}
                        </Text>
                        {userAnswers[index] === q.correctAnswer ? (
                          <Icon source="check" size={20} color="#4caf50" />
                        ) : (
                          <Icon source="close" size={20} color="#f44336" />
                        )}
                      </View>
                      <Text style={styles.explanationText}>
                        Explanation: {q.explanation}
                      </Text>
                    </Card.Content>
                  </Card>
                ))}

                <View style={styles.resultButtonContainer}>
                  <Button
                    mode="contained"
                    onPress={() => setSelectedQuiz(null)}
                    style={styles.backToQuizzesButton}>
                    Back to Quizzes
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={resetQuizState}
                    style={styles.restartButton}>
                    Restart Quiz
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </ScrollView>
        </LinearGradient>
      );
    }

    return (
      <LinearGradient colors={['#4e54c8', '#8f94fb']} style={styles.container}>
        <ScrollView contentContainerStyle={styles.quizContainer}>
          <View style={styles.quizHeader}>
            <Button
              icon="arrow-left"
              mode="text"
              onPress={() => setSelectedQuiz(null)}
              style={styles.backButton}>
              Back
            </Button>
            <Title style={styles.quizTitle}>{currentQuiz.title}</Title>
          </View>

          <ProgressBar
            progress={(currentQuestion + 1) / currentQuizQuestions.length}
            color="#fff"
          />

          <Card style={styles.questionCard}>
            <Card.Content>
              <Title style={styles.questionTitle}>
                {currentQuizQuestions[currentQuestion].question}
              </Title>

              <RadioButton.Group
                onValueChange={value => setSelectedAnswer(value)}
                value={selectedAnswer}>
                {currentQuizQuestions[currentQuestion].options.map(
                  (option, index) => (
                    <Pressable
                      onPress={value => setSelectedAnswer(option)}
                      key={index}
                      style={styles.radioContainer}>
                      <RadioButton value={option} />
                      <Text style={styles.radioLabel}>{option}</Text>
                    </Pressable>
                  ),
                )}
              </RadioButton.Group>

              <Button
                mode="contained"
                onPress={handleAnswer}
                disabled={!selectedAnswer}
                style={styles.submitButton}>
                {currentQuestion === currentQuizQuestions.length - 1
                  ? 'Finish'
                  : 'Next Question'}
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </LinearGradient>
    );
  };

  return selectedQuiz === null ? <RenderQuizSelection /> : <RenderQuiz />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainTitle: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 24,
    marginVertical: 20,
  },
  quizSelectionContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  quizCard: {
    marginBottom: 15,
    elevation: 4,
  },
  quizCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quizCardTitle: {
    marginLeft: 15,
    fontSize: 18,
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    marginRight: 10,
  },
  quizTitle: {
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  quizContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    width: Dimensions.get('window').width,
  },
  questionCard: {
    marginTop: 20,
    elevation: 4,
  },
  questionTitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioLabel: {
    marginLeft: 10,
  },
  submitButton: {
    marginTop: 20,
  },
  resultCard: {
    // width: '100%',
    padding: 20,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
  },
  restartButton: {
    // marginTop: 10,
  },
  resultContainer: {
    // flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  resultTitle: {
    textAlign: 'center',
    fontSize: 22,
    marginBottom: 15,
    color: '#fff',
  },
  statSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: 'black',
  },
  detailsTitle: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 15,
    color: '#4e54c8',
  },
  questionResultCard: {
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  questionText: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 16,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userAnswerLabel: {
    color: '#666',
  },
  userAnswer: {
    fontWeight: 'bold',
    marginRight: 10,
    flex: 1,
  },
  explanationText: {
    color: '#666',
    fontStyle: 'italic',
  },
  resultButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 10,
  },
  backToQuizzesButton: {
    flex: 1,
    borderWidth: 1,
    marginRight: 10,
  },
});
