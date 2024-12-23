import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Firebase } from '../firebaseConfig';
import { getFirestore, collection, getDocs, DocumentData } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CartContext } from './CartContext';

export type RootStackParamList = {
  AuthenticationScreen: undefined;
  ProductPage: undefined;
  ProductDetail: { product: Product };
  Cart: undefined;
  Checkout:undefined,
  UpdateProfile: undefined;
};

type ProductPageNavigationProp = StackNavigationProp<RootStackParamList, 'ProductPage'>;

export interface Product {
  id: number;
  name: string;
  condition: number;
  price: number;
  description: string;
}

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const { cartItems, addToCart } = useContext(CartContext);
  const navigation = useNavigation<ProductPageNavigationProp>();
  const Firestore = getFirestore(Firebase);

  // Monitor network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  // Fetch products from Firestore or AsyncStorage
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (isOffline) {
          // Load products from AsyncStorage in offline mode
          const storedProducts = await AsyncStorage.getItem('downloadedGoods');
          if (storedProducts) {
            const parsedProducts = JSON.parse(storedProducts);
            if (Array.isArray(parsedProducts)) {
              setProducts(parsedProducts);
              setFilteredProducts(parsedProducts);
            } else {
              console.error('Invalid products data in AsyncStorage');
            }
          } else {
            Alert.alert('Offline Mode', 'No downloaded goods available.');
          }
        } else {
          // Fetch products from Firestore
          const productsCollection = await getDocs(collection(Firestore, 'Goods'));
          const productData: Product[] = productsCollection.docs.map((doc: DocumentData) => {
            const data = doc.data();
            return {
              id: doc.id, // Use Firestore's document ID
              name: data.name || 'Unknown Product',
              condition: Number(data.condition) || 0, // Ensure condition is a number
              price: Number(data.price) || 0, // Ensure price is a number
              description: data.description || 'No description available',
            };
          });
          setProducts(productData);
          setFilteredProducts(productData);
        }
      } catch (error) {
        console.error('Error fetching products: ', error);
        Alert.alert('Error', 'Failed to fetch products. Please try again.');
      }
    };
    fetchProducts();
  }, [isOffline]);

  // Filter products based on search and price range
  useEffect(() => {
    const filterProducts = () => {
      let filtered = products;

      if (search) {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      filtered = filtered.filter(
        product => product.price >= priceRange.min && product.price <= priceRange.max
      );

      setFilteredProducts(filtered);
    };
    filterProducts();
  }, [search, priceRange, products]);

  // Toggle favorite products
  const toggleFavorite = async (productId: number) => {
    const updatedFavorites = favorites.includes(productId)
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId];
    setFavorites(updatedFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hey Maryam,</Text>
        <Text style={styles.subtitle}>Find a product you want to explore</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Text style={styles.cartIcon}>🛒 {cartItems.length}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.profileLink}
        onPress={() => navigation.navigate('UpdateProfile')}
      >
        <Text style={styles.profileLinkText}>Update Profile</Text>
      </TouchableOpacity>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for anything"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Product Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productCard}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
          >
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => toggleFavorite(item.id)}
            >
              <Text>{favorites.includes(item.id) ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
            <Image style={styles.productImage} source={{ uri: 'https://via.placeholder.com/100' }} />
            <Text style={styles.productTitle}>{item.name}</Text>
            <Text style={styles.productPrice}>${item.price}</Text>
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={() => addToCart(item)}
            >
              <Text style={styles.addToCartButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => (item?.id ? `${item.id}-${index}` : `fallback-${index}`)}
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
  cartIcon: {
    fontSize: 24,
    position: 'absolute',
    right: 10,
    top: 0,
  },
  productCard: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 12,
  },
  addToCartButton: {
    backgroundColor: '#6200ee',
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  profileLink: {
    alignSelf: 'flex-end',
    marginBottom: 10,
    marginRight: 270,
  },
  profileLinkText: {
    fontSize: 14,
    color: '#6200ee',
    textDecorationLine: 'underline',
  },
});

export default ProductPage;
