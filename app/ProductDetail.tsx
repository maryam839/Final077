import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './ProductPage';

type CourseDetailScreenRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;
type CourseDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProductDetail'>;

interface CourseDetailProps {
  route: CourseDetailScreenRouteProp;
  navigation: CourseDetailScreenNavigationProp;
}

interface Review {
  id: string;
  rating: number;
  text: string;
}

const ProductDetail = ({ route, navigation }: CourseDetailProps) => {
  const { product } = route.params;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState<number | null>(null);

  const submitReview = () => {
    if (!rating || !reviewText.trim()) {
      Alert.alert('Error', 'Please provide a rating and a review.');
      return;
    }

    const newReview: Review = {
      id: Math.random().toString(), // Generate a unique ID for the review
      rating,
      text: reviewText.trim(),
    };

    setReviews(prevReviews => [newReview, ...prevReviews]);
    setReviewText('');
    setRating(null);
    Alert.alert('Success', 'Your review has been submitted.');
  };

  const renderStar = (value: number) => (
    <TouchableOpacity
      key={`star-${value}`}
      onPress={() => setRating(value)}
    >
      <Text style={[
        styles.star,
        (rating ?? 0) >= value ? styles.starFilled : styles.starEmpty // Use nullish coalescing to handle null
      ]}>
        ★
      </Text>
    </TouchableOpacity>
  );
 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.description}>Condition: {product.condition}</Text>
      <Text style={styles.description}>Price: ${product.price}</Text>
      <Text style={styles.description}>Description: {product.description}</Text>

      {/* Rating and Review Input */}
      <View style={styles.reviewInputContainer}>
        <Text style={styles.sectionTitle}>Leave a Review</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map(renderStar)}
        </View>
        <TextInput
          style={styles.reviewInput}
          placeholder="Write your review..."
          value={reviewText}
          onChangeText={setReviewText}
        />
        <TouchableOpacity style={styles.submitButton} onPress={submitReview}>
          <Text style={styles.submitButtonText}>Submit Review</Text>
        </TouchableOpacity>
      </View>

      {/* Reviews List */}
      <View style={styles.reviewsContainer}>
        <Text style={styles.sectionTitle}>Reviews</Text>
        {reviews.length === 0 ? (
          <Text style={styles.noReviewsText}>No reviews yet. Be the first to review!</Text>
        ) : (
          <FlatList
            data={reviews}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewRating}>
                    {Array(item.rating).fill('★').join('')}
                  </Text>
                </View>
                <Text style={styles.reviewText}>{item.text}</Text>
              </View>
            )}
          />
        )}
      </View>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  star: {
    fontSize: 30,
    marginHorizontal: 5,
  },
  starEmpty: {
    color: '#ccc',
  },
  starFilled: {
    color: '#f5a623',
  },
  reviewInputContainer: {
    marginVertical: 20,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewsContainer: {
    marginTop: 20,
  },
  noReviewsText: {
    fontSize: 16,
    color: '#777',
  },
  reviewItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  reviewRating: {
    fontSize: 16,
    color: '#f5a623',
    fontWeight: 'bold',
  },
  reviewText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ProductDetail;
