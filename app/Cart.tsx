import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CartContext } from './CartContext';
import { useNavigation } from '@react-navigation/native';

const CartScreen = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useContext(CartContext);
  const navigation = useNavigation();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart is empty', 'Please add some items to your cart before proceeding.');
      return;
    }
    //navigation.navigate('Checkout');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyCart}>Your cart is empty.</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                </View>

                {/* Quantity Control */}
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item, Math.max(item.quantity - 1, 1))}
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item, item.quantity + 1)}
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>

                {/* Remove Button */}
                <TouchableOpacity onPress={() => removeFromCart(item)} style={styles.removeButton}>
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item, index) => item.id?.toString() || `fallback-${index}`}
          />

          {/* Total Price */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: ${getTotalPrice().toFixed(2)}</Text>
          </View>

          {/* Proceed to Checkout */}
          <TouchableOpacity
            style={[
              styles.checkoutButton,
              cartItems.length === 0 && styles.disabledCheckoutButton,
            ]}
            onPress={handleCheckout}
            disabled={cartItems.length === 0}
          >
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f7f7f9' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  emptyCart: { fontSize: 16, color: '#7a7a7a', textAlign: 'center' },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    elevation: 3,
  },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: 'bold' },
  itemPrice: { fontSize: 16, color: '#555' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 },
  quantityButton: {
    backgroundColor: '#ddd',
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityButtonText: { fontSize: 16, fontWeight: 'bold' },
  quantityText: { fontSize: 16, fontWeight: 'bold' },
  removeButton: { marginLeft: 10 },
  removeButtonText: { color: '#ff0000', fontSize: 14 },
  totalContainer: { marginTop: 20, alignItems: 'flex-end' },
  totalText: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  checkoutButton: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  disabledCheckoutButton: { backgroundColor: '#aaa' },
  checkoutButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default CartScreen;
