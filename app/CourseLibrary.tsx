import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Firebase } from '../firebaseConfig';
import { getFirestore, collection, getDocs, DocumentData } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
    CourseLibrary: undefined;  
    CourseDetail: { course: Course };  
    Quiz: { courseTitle: string };
};

type CourseLibraryNavigationProp = StackNavigationProp<RootStackParamList, 'CourseLibrary'>;

interface Course {
  id: number,
  title: string;
  category: string;
  difficulty: number;
  description: string;
}

const CourseLibrary = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isOffline, setIsOffline] = useState(false);

  const navigation = useNavigation<CourseLibraryNavigationProp>(); 

  const Firestore = getFirestore(Firebase);

  // Check network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  // Fetch courses from Firestore or local storage
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (isOffline) {
          // Load courses from local storage
          const storedCourses = await AsyncStorage.getItem('downloadedCourses');
          if (storedCourses) {
            setCourses(JSON.parse(storedCourses));
            setFilteredCourses(JSON.parse(storedCourses));
          } else {
            Alert.alert('Offline Mode', 'No downloaded courses available.');
          }
        } else {
          // Fetch courses from Firestore
          const coursesCollection = await getDocs(collection(Firestore, 'Courses'));
          const courseData: Course[] = coursesCollection.docs.map(
            (doc: DocumentData) => doc.data() as Course
          );
          setCourses(courseData);
          setFilteredCourses(courseData);
        }
      } catch (error) {
        console.error('Error fetching courses: ', error);
      }
    };
    fetchCourses();
  }, [isOffline]);

  useEffect(() => {
    const filterCourses = () => {
      if (!search) {
        setFilteredCourses(courses);
      } else {
        setFilteredCourses(
          courses.filter(course =>
            course.title.toLowerCase().includes(search.toLowerCase())
          )
        );
      }
    };
    filterCourses();
  }, [search, courses]);

  const downloadCourse = async (course: Course) => {
    try {
      const storedCourses = await AsyncStorage.getItem('downloadedCourses');
      const downloadedCourses: Course[] = storedCourses ? JSON.parse(storedCourses) : [];

      if (!downloadedCourses.find(c => c.title === course.title)) {
        downloadedCourses.push(course);
        await AsyncStorage.setItem('downloadedCourses', JSON.stringify(downloadedCourses));
        Alert.alert('Download Successful', `${course.title} has been downloaded for offline use.`);
      } else {
        Alert.alert('Already Downloaded', `${course.title} is already downloaded.`);
      }
    } catch (error) {
      console.error('Error downloading course: ', error);
    }
  };
  const handleSeeAll = () => {
    setSearch(''); 
    setFilteredCourses(courses); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hey Maryam,</Text>
        <Text style={styles.subtitle}>Find a course you want to learn</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for anything"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Offline Mode Info */}
      {isOffline && <Text style={styles.offlineText}>You are in offline mode</Text>}
      
      {/* Category Section */}
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryTitle}>All Courses</Text>
        <TouchableOpacity onPress={handleSeeAll}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      {/* Course Grid */}
      <FlatList
        data={filteredCourses}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.courseCard}
            onPress={() => navigation.navigate('CourseDetail', { course: item })}
          >
            <Image
              style={styles.courseImage}
              source={{ uri: 'https://via.placeholder.com/100' }} 
            />
            <Text style={styles.courseTitle}>{item.title}</Text>
            <Text style={styles.courseCategory}>{item.category}</Text>
            <Text style={styles.courseCategory}>{item.difficulty}</Text>
            <Text style={styles.courseDescription}>{item.description}</Text>
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => downloadCourse(item)}
            >
              <Text style={styles.downloadButtonText}>Download</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f9',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#7a7a7a',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 10,
  },
  searchIcon: {
    color: '#fff',
    fontSize: 16,
  },
  offlineText: {
    textAlign: 'center',
    color: '#ff0000',
    marginBottom: 10,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    color: '#6200ee',
  },
  courseCard: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
    alignItems: 'center',
  },
  courseImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  courseCategory: {
    fontSize: 12,
    color: '#7a7a7a',
  },
  courseDescription: {
    fontSize: 12,
    color: '#7a7a7a',
    marginBottom: 10,
  },
  downloadButton: {
    backgroundColor: '#6200ee',
    padding: 8,
    borderRadius: 5,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default CourseLibrary;
