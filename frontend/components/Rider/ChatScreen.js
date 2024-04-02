import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { GiftedChat, Bubble, Send, InputToolbar, Avatar, Day, Time } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';
import { decode as atob } from 'base-64';
global.atob = atob;
import { jwtDecode} from 'jwt-decode'; // Updated import
import { Ionicons } from '@expo/vector-icons';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);

  const fetchUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        setUser({
          _id: decoded.user_id, // The key must match the payload key in JWT
          name: decoded.name,
          // other user details
        });
        connectToSocket(token);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const connectToSocket = (token) => {
    const newSocket = io(`https://${process.env.EXPO_PUBLIC_API_CHAT_API}`, {
      query: { token },
    });

    newSocket.on('connect', () => {
      console.log('Socket.IO connected');
    });

    newSocket.on('previous messages', (messages) => {
      const sortedMessages = messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setMessages(sortedMessages);
    });

    newSocket.on('new message', (message) => {
      setMessages((prevMessages) => GiftedChat.append(prevMessages, message));
    });

    setSocket(newSocket);
  };

  useEffect(() => {
    fetchUserInfo();
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const onSend = (newMessages = []) => {
    if (socket) {
      // Assuming `user` state has `_id` and `name` fields after decoding JWT
      const messageWithUser = {
        ...newMessages[0],
        user: {
          _id: user._id,
          name: user.name,
        },
      };
      socket.emit('new message', messageWithUser);
    } else {
      console.log('Socket is not connected');
    }
  };
  

  const renderBubble = (props) => {
    // Compare the current message user id with the current user's id
    const isUserMessage = props.currentMessage.user._id === user._id;
  
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: isUserMessage ? styles.userBubble : {},
          left: !isUserMessage ? styles.otherUserBubble : {},
        }}
        textStyle={{
          right: isUserMessage ? styles.userText : {},
          left: !isUserMessage ? styles.otherUserText : {},
        }}
      />
    );
  };

  const renderAvatar = (props) => {
    const { currentMessage } = props;
    const initials = currentMessage.user.name
      ? currentMessage.user.name
          .split(' ')
          .map((name) => name[0])
          .join('')
          .toUpperCase()
      : 'U';

    return (
      <Avatar
        {...props}
        containerStyle={{
          left: styles.avatarContainer,
          right: styles.avatarContainer,
        }}
        textStyle={{
          left: styles.avatarText,
          right: styles.avatarText,
        }}
      >
        {initials}
      </Avatar>
    );
  };

  const renderSend = (props) => {
    return (
      <Send {...props} containerStyle={styles.sendContainer}>
        <Ionicons name="send" size={28} color="#007AFF" />
      </Send>
    );
  };
  const renderDay = (props) => {
    return (
      <Day
        {...props}
        textStyle={{ color: '#B0B0B0' }}
        wrapperStyle={{ backgroundColor: 'transparent' }}
      />
    );
  };
  const renderTime = (props) => (
    <Time {...props} timeTextStyle={{ left: { color: 'grey' }, right: { color: 'white' } }} />
  );

  const renderInputToolbar = (props) => {
    return <InputToolbar {...props} containerStyle={styles.inputToolbar} />;
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: user?._id,
          name: user?.name,
        }}
        renderBubble={renderBubble}
        renderAvatar={renderAvatar}
        renderSend={renderSend}
        renderInputToolbar={renderInputToolbar}
        placeholder="Type your message..."
        alwaysShowSend
        renderDay={renderDay}
        renderTime={renderTime}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  userBubble: {
    backgroundColor: '#007AFF',
  },
  otherUserBubble: {
    backgroundColor: '#E5E5EA',
  },
  userText: {
    color: '#FFFFFF',
  },
  otherUserText: {
    color: '#000000',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  inputToolbar: {
    marginTop: 6,
    marginHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
  }
});

export default ChatScreen;