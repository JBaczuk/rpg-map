import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Main from './src/Main';

export default function App () {
  return (
    <Main mapUrl='https://i1.wp.com/www.fantasticmaps.com/wp-content/uploads/2015/12/8.jpg' />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
