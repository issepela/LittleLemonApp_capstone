import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ScrollView, StyleSheet } from 'react-native';

const Filters = ({sections, selected, onChange}) => {

  return (
    <View style={styles.menuOptions}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {sections.map((section, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuButton, selected === section && styles.selectedButton]}
            onPress={() => onChange(section)}
          >
            <Text style={styles.menuText}>{section}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  menuOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
  menuButton: {
    backgroundColor: '#EDEFEE',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 5,
  },
  selectedButton: {
    backgroundColor: '#F4CE14',
  },
  menuText: {
    color: '#333',
  },
});

export default Filters;
