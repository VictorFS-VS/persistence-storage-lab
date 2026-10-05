import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

type UserProfile = {
  name: string;
  email: string;
};

type UserAction = {
  id: number;
  text: string;
  date: string;
};

type NotificationItem = {
  id: number;
  message: string;
  date: string;
};

export default function HomeScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [actionText, setActionText] = useState('');
  const [notificationText, setNotificationText] = useState('');

  const [savedProfile, setSavedProfile] =
    useState<UserProfile | null>(null);

  const [actions, setActions] =
    useState<UserAction[]>([]);

  const [notifications, setNotifications] =
    useState<NotificationItem[]>([]);

  /*
   * ---------------------------------------------------------
   * USER PROFILE
   * ---------------------------------------------------------
   */

  const saveUserProfile = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert(
        'Error',
        'Please enter name and email.'
      );
      return;
    }

    const profile: UserProfile = {
      name: name.trim(),
      email: email.trim(),
    };

    try {
      await AsyncStorage.setItem(
        'userProfile',
        JSON.stringify(profile)
      );

      setSavedProfile(profile);

      Alert.alert(
        'Success',
        'User profile saved successfully.'
      );
    } catch (error) {
      console.log(
        'Error saving user profile:',
        error
      );
    }
  };

  const getUserProfile = async () => {
    try {
      const profile =
        await AsyncStorage.getItem('userProfile');

      if (profile) {
        const parsedProfile: UserProfile =
          JSON.parse(profile);

        setSavedProfile(parsedProfile);
        setName(parsedProfile.name);
        setEmail(parsedProfile.email);
      } else {
        setSavedProfile(null);
      }
    } catch (error) {
      console.log(
        'Error fetching user profile:',
        error
      );
    }
  };

  /*
   * ---------------------------------------------------------
   * USER ACTIONS
   * ---------------------------------------------------------
   */

  const saveUserAction = async () => {
    if (!actionText.trim()) {
      Alert.alert(
        'Error',
        'Enter an action first.'
      );
      return;
    }

    try {
      const storedActions =
        await AsyncStorage.getItem('userActions');

      const currentActions: UserAction[] =
        storedActions
          ? JSON.parse(storedActions)
          : [];

      const newAction: UserAction = {
        id: Date.now(),
        text: actionText.trim(),
        date: new Date().toLocaleString(),
      };

      const updatedActions = [
        ...currentActions,
        newAction,
      ];

      await AsyncStorage.setItem(
        'userActions',
        JSON.stringify(updatedActions)
      );

      setActions(updatedActions);
      setActionText('');
    } catch (error) {
      console.log(
        'Error saving user action:',
        error
      );
    }
  };

  const getUserActions = async () => {
    try {
      const storedActions =
        await AsyncStorage.getItem('userActions');

      if (storedActions) {
        setActions(
          JSON.parse(storedActions)
        );
      } else {
        setActions([]);
      }
    } catch (error) {
      console.log(
        'Error fetching actions:',
        error
      );
    }
  };

  /*
   * ---------------------------------------------------------
   * NOTIFICATIONS
   * ---------------------------------------------------------
   */

  const saveNotification = async () => {
    if (!notificationText.trim()) {
      Alert.alert(
        'Error',
        'Enter a notification first.'
      );
      return;
    }

    try {
      const storedNotifications =
        await AsyncStorage.getItem(
          'notifications'
        );

      const currentNotifications:
        NotificationItem[] =
        storedNotifications
          ? JSON.parse(storedNotifications)
          : [];

      const newNotification:
        NotificationItem = {
          id: Date.now(),
          message: notificationText.trim(),
          date: new Date().toLocaleString(),
        };

      const updatedNotifications = [
        ...currentNotifications,
        newNotification,
      ];

      await AsyncStorage.setItem(
        'notifications',
        JSON.stringify(updatedNotifications)
      );

      setNotifications(
        updatedNotifications
      );

      setNotificationText('');
    } catch (error) {
      console.log(
        'Error saving notification:',
        error
      );
    }
  };

  const getNotifications = async () => {
    try {
      const storedNotifications =
        await AsyncStorage.getItem(
          'notifications'
        );

      if (storedNotifications) {
        setNotifications(
          JSON.parse(storedNotifications)
        );
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.log(
        'Error fetching notifications:',
        error
      );
    }
  };

  /*
   * ---------------------------------------------------------
   * LOAD ALL STORED DATA
   * ---------------------------------------------------------
   */

  const loadAllData = async () => {
    try {
      await Promise.all([
        getUserProfile(),
        getUserActions(),
        getNotifications(),
      ]);
    } catch (error) {
      console.log(
        'Error loading stored data:',
        error
      );
    }
  };

  /*
   * ---------------------------------------------------------
   * CLEAR ALL LOCAL STORAGE
   * ---------------------------------------------------------
   */

  const clearAllData = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(
          'userProfile'
        ),
        AsyncStorage.removeItem(
          'userActions'
        ),
        AsyncStorage.removeItem(
          'notifications'
        ),
      ]);

      setName('');
      setEmail('');
      setActionText('');
      setNotificationText('');

      setSavedProfile(null);
      setActions([]);
      setNotifications([]);

      Alert.alert(
        'Success',
        'All local storage data was deleted.'
      );
    } catch (error) {
      console.log(
        'Error clearing local storage:',
        error
      );
    }
  };

  /*
   * ---------------------------------------------------------
   * LOAD STORED DATA ON START
   * ---------------------------------------------------------
   */

  useEffect(() => {
    loadAllData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER */}

        <View style={styles.header}>
          <Text style={styles.title}>
            Persistence Storage Lab
          </Text>

          <Text style={styles.description}>
            AsyncStorage - React Native
          </Text>
        </View>

        {/* USER PROFILE */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            1. User Profile
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={styles.button}
            onPress={saveUserProfile}
          >
            <Text style={styles.buttonText}>
              Save Profile
            </Text>
          </TouchableOpacity>

          {savedProfile && (
            <View style={styles.savedBox}>
              <Text style={styles.savedTitle}>
                ✓ Stored Profile
              </Text>

              <Text style={styles.savedText}>
                Name: {savedProfile.name}
              </Text>

              <Text style={styles.savedText}>
                Email: {savedProfile.email}
              </Text>
            </View>
          )}
        </View>

        {/* USER ACTIONS */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            2. User Actions
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Example: Viewed movie details"
            value={actionText}
            onChangeText={setActionText}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={saveUserAction}
          >
            <Text style={styles.buttonText}>
              Save Action
            </Text>
          </TouchableOpacity>

          {actions.length > 0 && (
            <View style={styles.savedBox}>
              <Text style={styles.savedTitle}>
                ✓ Stored Actions
              </Text>

              {actions.map((action) => (
                <View
                  key={action.id}
                  style={styles.item}
                >
                  <Text style={styles.itemText}>
                    • {action.text}
                  </Text>

                  <Text style={styles.date}>
                    {action.date}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* NOTIFICATIONS */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            3. Notifications
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Example: New movie available"
            value={notificationText}
            onChangeText={setNotificationText}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={saveNotification}
          >
            <Text style={styles.buttonText}>
              Save Notification
            </Text>
          </TouchableOpacity>

          {notifications.length > 0 && (
            <View style={styles.savedBox}>
              <Text style={styles.savedTitle}>
                ✓ Stored Notifications
              </Text>

              {notifications.map(
                (notification) => (
                  <View
                    key={notification.id}
                    style={styles.item}
                  >
                    <Text
                      style={styles.itemText}
                    >
                      • {notification.message}
                    </Text>

                    <Text style={styles.date}>
                      {notification.date}
                    </Text>
                  </View>
                )
              )}
            </View>
          )}
        </View>

        {/* LOAD ALL */}

        <TouchableOpacity
          style={styles.loadButton}
          onPress={loadAllData}
        >
          <Text style={styles.buttonText}>
            Load All Stored Data
          </Text>
        </TouchableOpacity>

        {/* CLEAR STORAGE */}

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={clearAllData}
        >
          <Text style={styles.buttonText}>
            Clear Local Storage
          </Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            ✓ Data is stored locally using
            AsyncStorage.
          </Text>

          <Text style={styles.infoText}>
            ✓ Stored data remains available
            after reloading the application.
          </Text>
        </View>

        <Text style={styles.footer}>
          Persistence Storage Lab
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },

  content: {
    width: '100%',
    paddingHorizontal: 20,

    // Espacio para evitar que el navbar
    // de Expo tape el título.
    paddingTop: 100,

    paddingBottom: 40,
    alignItems: 'center',
  },

  header: {
    width: '100%',
    maxWidth: 750,
    alignItems: 'center',
    marginBottom: 25,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0f172a',
    marginBottom: 6,
  },

  description: {
    fontSize: 17,
    color: '#64748b',
    textAlign: 'center',
  },

  card: {
    width: '100%',
    maxWidth: 750,
    backgroundColor: '#ffffff',
    padding: 25,
    borderRadius: 16,
    marginBottom: 24,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 18,
  },

  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 14,
    marginBottom: 15,
    backgroundColor: '#ffffff',
    fontSize: 16,
    color: '#0f172a',
  },

  button: {
    width: '100%',
    backgroundColor: '#2563eb',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },

  loadButton: {
    width: '100%',
    maxWidth: 750,
    backgroundColor: '#475569',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },

  deleteButton: {
    width: '100%',
    maxWidth: 750,
    backgroundColor: '#dc2626',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },

  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  savedBox: {
    marginTop: 18,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 10,
    padding: 15,
  },

  savedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 10,
  },

  savedText: {
    fontSize: 15,
    color: '#334155',
    marginBottom: 4,
  },

  item: {
    borderBottomWidth: 1,
    borderBottomColor: '#dcfce7',
    paddingVertical: 8,
  },

  itemText: {
    fontSize: 15,
    color: '#334155',
  },

  date: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 3,
    marginLeft: 10,
  },

  infoBox: {
    width: '100%',
    maxWidth: 750,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 10,
    padding: 15,
    marginTop: 5,
  },

  infoText: {
    color: '#1e40af',
    fontSize: 14,
    marginVertical: 3,
  },

  footer: {
    marginTop: 25,
    marginBottom: 20,
    color: '#64748b',
    fontSize: 13,
    textAlign: 'center',
  },
});