import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Định nghĩa kiểu dữ liệu cho công việc
interface Task {
  id: string;
  text: string;
  completed: boolean;
}

const API_URL = 'https://testbackend-94at.onrender.com//api/tasks'; // Thay bằng IP nếu chạy trên thiết bị thật

const TodoList: React.FC = () => {
  const [task, setTask] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);

  // Lấy danh sách công việc khi component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Lấy danh sách công việc
  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Thêm công việc
  const addTask = async () => {
    if (task.trim()) {
      try {
        const response = await axios.post(API_URL, { text: task });
        setTasks([...tasks, response.data]);
        setTask('');
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  // Xóa công việc
  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Xóa tất cả công việc
  const deleteAllTasks = async () => {
    try {
      await axios.delete(API_URL);
      setTasks([]);
    } catch (error) {
      console.error('Error deleting all tasks:', error);
    }
  };

  // Đánh dấu công việc hoàn thành
  const toggleComplete = async (id: string) => {
    try {
      const response = await axios.put(`${API_URL}/${id}/toggle`);
      setTasks(
        tasks.map((item) =>
          item.id === id ? response.data : item
        )
      );
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  // Render item
  const renderItem = ({ item }: { item: Task }) => (
    <View style={styles.task}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => toggleComplete(item.id)}
      >
        <Ionicons
          name={item.completed ? 'checkbox' : 'square-outline'}
          size={24}
          color={item.completed ? '#4CAF50' : '#CCC'}
        />
      </TouchableOpacity>
      <Text style={[styles.taskText, item.completed && styles.completedText]}>
        {item.text}
      </Text>
      <TouchableOpacity onPress={() => deleteTask(item.id)}>
        <Ionicons name="trash" size={24} color="#FF5252" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>To-Do List</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Thêm công việc..."
          value={task}
          onChangeText={setTask}
          returnKeyType="done"
          onSubmitEditing={addTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>Chưa có công việc!</Text>}
      />
      {tasks.length > 0 && (
        <TouchableOpacity style={styles.deleteAllButton} onPress={deleteAllTasks}>
          <Text style={styles.deleteAllText}>Xóa tất cả</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 15,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  task: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  checkbox: {
    marginRight: 10,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
  deleteAllButton: {
    backgroundColor: '#FF5252',
    borderRadius: 8,
    padding: 12,
    marginTop: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  deleteAllText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TodoList;