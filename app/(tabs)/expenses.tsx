import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function ExpensesManagerScreen() {
  const data = [
    {
      name: 'Food',
      population: 35,
      color: '#388E3C',
      legendFontColor: '#333',
      legendFontSize: 13,
    },
    {
      name: 'Travel',
      population: 25,
      color: '#FBC02D',
      legendFontColor: '#333',
      legendFontSize: 13,
    },
    {
      name: 'Shopping',
      population: 20,
      color: '#37474F',
      legendFontColor: '#333',
      legendFontSize: 13,
    },
    {
      name: 'Others',
      population: 20,
      color: '#D32F2F',
      legendFontColor: '#333',
      legendFontSize: 13,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Expenses Manager</Text>

      {/* Summary Box */}
      <View style={styles.summaryCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Total Cost</Text>
          <Text style={styles.amount}>Rs 2,00,000</Text>
          <Text style={styles.tour}>Kathmandu Tour</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.label}>Persons</Text>
          <Icon name="people" size={24} color="#2E7D32" />
          <TouchableOpacity style={styles.splitBtn}>
            <Text style={styles.splitText}>Split Bill</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Pie Chart Breakdown */}
      <Text style={styles.subHeader}>Expenses Breakdown</Text>
      <Text style={styles.tourRight}>Kathmandu Tour</Text>

      <View style={{ alignItems: 'center', marginTop: -10 }}>
        <PieChart
          data={data}
          width={screenWidth}
          height={170}
          chartConfig={{
            color: () => '#000',
          }}
          accessor={'population'}
          backgroundColor={'transparent'}
          hasLegend={false}
          paddingLeft={'15'}
          center={[0, 0]}
          absolute
        />
        <View style={styles.totalOverlay}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalAmount}>Rs 2,00,000</Text>
        </View>
      </View>

      {/* Export Button */}
      <TouchableOpacity style={styles.exportBtn}>
        <Icon name="document-outline" size={16} color="#D32F2F" />
        <Text style={styles.exportText}>Export</Text>
      </TouchableOpacity>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <LegendItem label="Food" color="#388E3C" percent="(35%)" />
        <LegendItem label="Travels" color="#FBC02D" percent="(25%)" />
        <LegendItem label="Shoppings" color="#37474F" percent="(20%)" />
        <LegendItem label="Others" color="#D32F2F" percent="(20%)" />
      </View>
    </View>
  );
}

const LegendItem = ({ label, color, percent }) => (
  <View style={styles.legendItem}>
    <View style={[styles.dot, { backgroundColor: color }]} />
    <Text style={styles.legendText}>
      {label} <Text style={{ color: '#777' }}>{percent}</Text>
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9EA',
    paddingTop: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#263238',
    paddingHorizontal: 20,
  },
  summaryCard: {
    backgroundColor: '#FFF3C4',
    borderRadius: 16,
    margin: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    color: '#37474F',
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#263238',
    marginTop: 4,
  },
  tour: {
    fontSize: 13,
    color: '#757575',
    marginTop: 2,
  },
  splitBtn: {
    marginTop: 8,
    backgroundColor: '#43A047',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  splitText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#37474F',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  tourRight: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'right',
    marginRight: 20,
    marginTop: -5,
  },
  totalOverlay: {
    position: 'absolute',
    top: 55,
    alignItems: 'center',
    color: "#ffff",
    left: 81,
  },
  totalText: {
    fontSize: 20,
    fontWeight: "900",
    color: '#ffffff',
  },
  totalAmount: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  exportBtn: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#43A047',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: -5,
  },
  exportText: {
    marginLeft: 6,
    color: '#43A047',
    fontWeight: '600',
  },
  legendContainer: {
    marginTop: 20,
    paddingHorizontal: 30,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
    color: '#263238',
  },
});
