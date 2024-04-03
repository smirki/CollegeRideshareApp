import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
// import React, { useState, useEffect, Screen, Button } from 'react';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';

const PaymentsScreen = ({ navigation }) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('hii');
    initializePaymentSheet();
  }, []);

  const fetchPaymentSheetParams = async () => {
    console.log('nnnn');
    const response = await fetch('http://127.0.0.1:5000/payment-sheet', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const { paymentIntent, ephemeralKey, customer } = await response.json();
    console.log(paymentIntent);
    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: 'saipriya.org',
      paymentIntentClientSecret: paymentIntent,
      customerEphemeralKeySecret: ephemeralKey,
      customerId: customer,

      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      // allowsDelayedPaymentMethods: true,
      // defaultBillingDetails: {
      //   name: 'Ayush Lanka',
      // },
    });
    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      console.log(error.message);
      alert(`Error code: ${error.code}`, error.message);
    } else {
      alert('Success', 'Your order is confirmed!');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Press me" onPress={openPaymentSheet} />
    </View>

    // <Screen>
    //   <Button
    //     variant="primary"
    //     disabled={!loading}
    //     title="Checkout"
    //     onPress={openPaymentSheet}
    //   />
    // </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default PaymentsScreen;
