import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme-context';

const screenWidth = Dimensions.get('window').width;

export default function ExpensesManagerScreen() {
  const { isDarkMode } = useTheme();

  const data = [
    { name: 'Food', population: 35, color: '#388E3C', legendFontColor: '#333', legendFontSize: 13 },
    { name: 'Travel', population: 25, color: '#FBC02D', legendFontColor: '#333', legendFontSize: 13 },
    { name: 'Shopping', population: 20, color: '#37474F', legendFontColor: '#333', legendFontSize: 13 },
    { name: 'Others', population: 20, color: '#D32F2F', legendFontColor: '#333', legendFontSize: 13 },
  ];

  const backgroundColor = isDarkMode ? '#121212' : '#F8F9EA';
  const cardBackground = isDarkMode ? '#1e1e1e' : '#FFF3C4';
  const textColor = isDarkMode ? '#fff' : '#263238';
  const subTextColor = isDarkMode ? '#aaa' : '#757575';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.header, { color: textColor }]}>Expenses Manager</Text>

      <View style={[styles.summaryCard, { backgroundColor: cardBackground }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.label, { color: textColor }]}>Total Cost</Text>
          <Text style={[styles.amount, { color: textColor }]}>Rs 2,00,000</Text>
          <Text style={[styles.tour, { color: subTextColor }]}>Kathmandu Tour</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={[styles.label, { color: textColor }]}>Persons</Text>
          <Icon name="people" size={24} color="#2E7D32" />
          <TouchableOpacity style={styles.splitBtn}>
            <Text style={styles.splitText}>Split Bill</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.subHeader, { color: textColor }]}>Expenses Breakdown</Text>
      <Text style={[styles.tourRight, { color: subTextColor }]}>Kathmandu Tour</Text>

      <View style={{ alignItems: 'center', marginTop: -10 }}>
        <PieChart
          data={data}
          width={screenWidth}
          height={170}
          chartConfig={{
            color: () => (isDarkMode ? '#fff' : '#000'),
          }}
          accessor="population"
          backgroundColor="transparent"
          hasLegend={false}
          paddingLeft="15"
          center={[0, 0]}
          absolute
        />
        <View style={styles.totalOverlay}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalAmount}>Rs 2,00,000</Text>
        </View>
      </View>

      <TouchableOpacity style={[styles.exportBtn, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
        <Icon name="document-outline" size={16} color="#D32F2F" />
        <Text style={styles.exportText}>Export</Text>
      </TouchableOpacity>

      <View style={styles.legendContainer}>
        <LegendItem label="Food" color="#388E3C" percent="(35%)" textColor={textColor} />
        <LegendItem label="Travels" color="#FBC02D" percent="(25%)" textColor={textColor} />
        <LegendItem label="Shoppings" color="#37474F" percent="(20%)" textColor={textColor} />
        <LegendItem label="Others" color="#D32F2F" percent="(20%)" textColor={textColor} />
      </View>
    </View>
  );
}

type LegendItemProps = {
  label: string;
  color: string;
  percent: string;
  textColor: string;
};

const LegendItem = ({ label, color, percent, textColor }: LegendItemProps) => (
  <View style={styles.legendItem}>
    <View style={[styles.dot, { backgroundColor: color }]} />
    <Text style={[styles.legendText, { color: textColor }]}>
      {label} <Text style={{ color: '#777' }}>{percent}</Text>
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
  summaryCard: {
    borderRadius: 16,
    margin: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  tour: {
    fontSize: 13,
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
    paddingHorizontal: 20,
    marginTop: 10,
  },
  tourRight: {
    fontSize: 12,
    textAlign: 'right',
    marginRight: 20,
    marginTop: -5,
  },
  totalOverlay: {
    position: 'absolute',
    top: 55,
    alignItems: 'center',
    left: 81,
  },
  totalText: {
    fontSize: 20,
    fontWeight: '900',
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
  },
});
