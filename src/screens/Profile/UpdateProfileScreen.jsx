import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import i18n from '../../config/i18n';

const UpdateProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    bio: 'Digital designer & photography enthusiast. Love collecting vintage items.',
    location: 'San Francisco, CA',
    phone: '+1 415-555-0132',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  });

  const handleUpdate = () => {
    // Handle profile update logic here
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#5e72e4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{i18n.t('PROFILE.UPDATE_PROFILE')}</Text>
        <TouchableOpacity onPress={handleUpdate}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.avatarContainer}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <TouchableOpacity style={styles.editAvatarButton}>
          <Feather name="camera" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={user.name}
            onChangeText={(text) => setUser({...user, name: text})}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value={user.email}
            onChangeText={(text) => setUser({...user, email: text})}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={user.phone}
            onChangeText={(text) => setUser({...user, phone: text})}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Location</Text>
          <TextInput
            style={styles.input}
            value={user.location}
            onChangeText={(text) => setUser({...user, location: text})}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={user.bio}
            onChangeText={(text) => setUser({...user, bio: text})}
            multiline
            numberOfLines={4}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal-Bold',
    color: '#32325d',
  },
  saveButton: {
    fontSize: 16,
    fontFamily: 'Tajawal-Medium',
    color: '#5e72e4',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#f0f2f5',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: '#5e72e4',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Tajawal-Medium',
    color: '#525f7f',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Tajawal-Regular',
    color: '#32325d',
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  deleteButton: {
    margin: 16,
    padding: 16,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    fontFamily: 'Tajawal-Medium',
    color: '#ff4757',
  },
});

export default UpdateProfileScreen;