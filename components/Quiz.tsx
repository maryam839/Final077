import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Firebase } from '../firebaseConfig';
import { getFirestore, collection, getDocs, query, where, DocumentData} from 'firebase/firestore';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../app/CourseLibrary';

type QuizScreenRouteProp = RouteProp<RootStackParamList, 'Quiz'>;

interface QuizProps {
  route: QuizScreenRouteProp;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const Quiz = ({ route }: QuizProps) => {
  const { courseTitle } = route.params;
  const [quizData, setQuizData] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const Firestore = getFirestore(Firebase);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        console.log('Course Title being queried:', courseTitle);
  
        const courseTitleTrimmed = courseTitle.trim();
  
        const courseQuery = query(
          collection(Firestore, 'Courses'),
          where('title', '==', courseTitleTrimmed)
        );
        const courseQuerySnapshot = await getDocs(courseQuery);
  
        if (!courseQuerySnapshot.empty) {
          const courseDoc = courseQuerySnapshot.docs[0];
          const courseId = courseDoc.id;
  
          const quizQuery = query(
            collection(Firestore, 'Quiz'),
            where('courseTitle', '==', courseTitleTrimmed)
          );
          const quizQuerySnapshot = await getDocs(quizQuery);
  
          console.log('Quiz Query Snapshot:', quizQuerySnapshot.docs.map(doc => doc.data()));
  
          if (!quizQuerySnapshot.empty) {
            const quizDoc = quizQuerySnapshot.docs[0];
            const quizData = quizDoc.data() as DocumentData;
  
            // Log the entire quiz data to inspect its structure
            console.log('Raw Quiz Data:', quizData);
  
            // Wrap the single question data in an array to match the expected structure
            const questionList: Question[] = Array.isArray(quizData) 
              ? quizData.map((question: any) => ({
                  question: question.question,
                  options: question.options,
                  correctAnswer: question.correctAnswer,
                  explanation: question.explanation,
                }))
              : [{
                  question: quizData.question,
                  options: quizData.options,
                  correctAnswer: quizData.correctAnswer,
                  explanation: quizData.explanation,
              }];
  
            setQuizData(questionList);
            console.log('Quiz Data Set:', questionList);
          } else {
            console.error('No quiz found for this course.');
          }
        } else {
          console.error('Course not found.');
        }
      } catch (error) {
        console.error('Error fetching quiz data: ', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchQuizData();
  }, [Firestore, courseTitle]);
  
  
  
  const handleAnswer = (option: string) => {
    setSelectedOption(option);
    if (option === quizData[currentQuestion].correctAnswer) {
      setFeedback('Correct! 🎉');
    } else {
      setFeedback(
        `Incorrect! The correct answer is ${quizData[currentQuestion].correctAnswer}.`
      );
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setFeedback(null);
    setCurrentQuestion((prev) => (prev + 1) % quizData.length);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (quizData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No quiz questions available for this course.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{quizData[currentQuestion].question}</Text>
      {quizData[currentQuestion].options.map((option) => (
        <TouchableOpacity
          key={option}
          onPress={() => handleAnswer(option)}
          style={[
            styles.option,
            selectedOption === option && {
              backgroundColor:
                option === quizData[currentQuestion].correctAnswer
                  ? '#4CAF50'
                  : '#F44336',
            },
          ]}
          disabled={!!selectedOption}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
      {feedback && <Text style={styles.feedback}>{feedback}</Text>}
      {selectedOption && (
        <TouchableOpacity onPress={handleNextQuestion} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  question: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  option: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
  },
  optionText: { fontSize: 16 },
  feedback: { marginTop: 20, fontSize: 16, fontWeight: 'bold' },
  nextButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 8,
  },
  nextButtonText: { color: '#fff', textAlign: 'center' },
  errorText: { fontSize: 16, color: '#ff0000', textAlign: 'center' },
});

export default Quiz;
