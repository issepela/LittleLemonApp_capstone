import React, { useState, useEffect, useUpdateEffect, useCallback, useMemo } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Searchbar } from 'react-native-paper';
import debounce from 'lodash.debounce';
import { initializeDatabase, loadMenuItems, loadinitialMenuItems } from './database'
import Filters from './filters'


function Home({navigation}) {
  const [avatar, setAvatar] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [searchBarText, setSearchBarText] = useState('');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const sections = ['Starters', 'Mains', 'Salads', 'Desserts', 'Drinks'];

  const go2profile = async () => {
    navigation.navigate('Profile')
  }
  
  useEffect(() => {
    (async () => {
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setFirstName(parsedData.firstName || '');
        setAvatar(parsedData.avatar || '');
        setLastName(parsedData.lastName || '');
      }
    })();
    //fetchMenuItems();
    initializeDatabase();
    loadinitialMenuItems(setMenuItems).then(() => setIsInitialized(true));
  }, []);

useEffect(() => {
  if (true) {
    loadMenuItems(setMenuItems, selected, query);
  }
}, [selected, query, isInitialized]);
  
 const renderItem = ({ item }) => (
    <View style={styles.menuItem}>
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuItemTitle}>{item.name}</Text>
        <Text style={styles.menuItemDescription} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <Image
        source={{ uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true` }}
        style={styles.menuItemImage}
      />
    </View>
  );


  const lookup = useCallback((q) => {
    setQuery(q);
  }, []);
  
  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

  const handleSearchChange = (text) => {
      setSearchBarText(text);
      debouncedLookup(text);
    };

  const handleSelect = async (section) => {
    // Toggle selection: if it's already selected, unselect it, else select it
    setSelected(selected === section ? '' : section);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/Logo.png')} style={styles.logo} />
        </View>
        <TouchableOpacity onPress={go2profile} style={styles.profileButton}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatarTop} />
          ) : (
            <Text style={styles.roundButton1}>
              {firstName[0]}
              {lastName[0] ? lastName[0] : ''}
            </Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.searchSection}>
        <Text style={styles.title}>Little Lemon</Text>
        <Text style={styles.subtitle}>Chicago</Text>
        <View style={styles.descriptionSection}>
          <View style={styles.textContainer}>
            <Text style={styles.description}>
              We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
            </Text>
          </View>
          <Image source={require('../assets/Hero image.png')} style={styles.mainimage} />
        </View>
        <Searchbar
            placeholder="Search"
            placeholderTextColor="white"
            onChangeText={handleSearchChange}
            value={searchBarText}
            style={styles.searchBar}
            iconColor="black"
            inputStyle={{ color: 'black' }}
            elevation={0}
          />
      </View>
      <View style={styles.menuSection}>
        <Text style={styles.menuTitle}>ORDER FOR DELIVERY!</Text>
        <Filters  
          selected={selected}
          onChange={handleSelect}
          sections={sections}/> 
      </View>
      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 40,
  },
  mainimage:{
    width: 120,
    height: 120,
    borderRadius: 10,
    marginLeft: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  profileButton: {
    position: 'absolute',
    right: 20,
  },
  avatarTop: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  roundButton1: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#495E57',
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  searchSection: {
    padding: 20,
    backgroundColor: '#495E57',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  descriptionSection:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F4CE14',
    fontFamily: 'MarkaziText-Medium',
  },
  subtitle: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'Karla-Regular',
  },
  description: {
    fontSize: 14,
    color: '#fff',
    marginVertical: 10,
    fontFamily: 'Karla-Regular',
  },
  menuSection: {
    padding: 10,
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: "left"
  },
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
  menuText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495E57',
  },
    menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#EDEFEE',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495E57'
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#495E57',
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  menuItemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  searchBar: {
    marginTop: 15,
    marginBottom: 5,
    shadowRadius: 0,
    shadowOpacity: 0,
  },
});

export default Home;
