import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './CourseLibrary'; 

type CourseDetailScreenRouteProp = RouteProp<RootStackParamList, 'CourseDetail'>;
type CourseDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CourseDetail'>;

interface CourseDetailProps {
  route: CourseDetailScreenRouteProp;
  navigation: CourseDetailScreenNavigationProp;
}

const CourseDetail = ({ route, navigation }: CourseDetailProps) => {
  const { course } = route.params;  
  const handleTakeQuiz = () => {
    navigation.navigate('Quiz', { courseTitle: course.title }); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{course.title}</Text>
      <Text style={styles.description}>{course.description}</Text>
      <Text style={styles.description}>Difficulty: {course.difficulty}</Text>
      <Text style={styles.description}>Category: {course.category}</Text>
      <TouchableOpacity style={styles.quizButton} onPress={handleTakeQuiz}>
        <Text style={styles.quizButtonText}>Take Quiz</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  quizButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
  },
  quizButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CourseDetail;