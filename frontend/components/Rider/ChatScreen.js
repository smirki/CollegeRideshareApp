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
        <Ionicons name="send" size={28} color="#FECC4C" />
      </Send>
    );
  };

  const renderDay = (props) => {
    return (
      <Day
        {...props}
        textStyle={{ color: '#7e7e7e' }}
        wrapperStyle={{ backgroundColor: 'transparent' }}
      />
    );
  };

  const renderTime = (props) => (
    <Time {...props} timeTextStyle={{ left: { color: '#7e7e7e' }, right: { color: '#7e7e7e' } }} />
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
    backgroundColor: '#000',
  },
  userBubble: {
    backgroundColor: '#FECC4C',
  },
  otherUserBubble: {
    backgroundColor: '#232323',
  },
  userText: {
    color: '#000',
  },
  otherUserText: {
    color: '#fff',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#424242',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
  },
  inputToolbar: {
    marginTop: 6,
    marginHorizontal: 10,
    paddingVertical: 0,
    borderRadius: 15,
    backgroundColor: '#232323',
    color: "white",
  },
});

export default ChatScreen;