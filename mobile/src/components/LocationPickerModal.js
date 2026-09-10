import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { X, Navigation, MapPin, Check } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { GLOBAL_CITIES } from '../services/weatherService';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

export default function LocationPickerModal() {
  const {
    isLocationModalOpen,
    setIsLocationModalOpen,
    activeLocation,
    updateLocationManually,
    refreshGpsLocation
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

  if (!isLocationModalOpen) return null;

  const filteredCities = GLOBAL_CITIES.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGpsClick = async () => {
    setIsDetecting(true);
    await refreshGpsLocation();
    setIsDetecting(false);
  };

  return (
    <Modal
      visible={isLocationModalOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsLocationModalOpen(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.modalSheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <MapPin size={18} color={colors.primary} />
              <Text style={styles.title}>Select Location</Text>
            </View>
            <TouchableOpacity
              onPress={() => setIsLocationModalOpen(false)}
              style={styles.closeBtn}
              activeOpacity={0.7}
            >
              <X size={18} color={colors.textDim} />
            </TouchableOpacity>
          </View>

          {/* GPS Button */}
          <TouchableOpacity
            onPress={handleGpsClick}
            disabled={isDetecting}
            activeOpacity={0.8}
            style={styles.gpsBtn}
          >
            <Navigation size={16} color={colors.primaryDark} />
            <Text style={styles.gpsBtnText}>
              {isDetecting ? 'Detecting GPS Coordinates...' : 'Use Precise GPS Auto-Location'}
            </Text>
          </TouchableOpacity>

          {/* Search Input */}
          <TextInput
            placeholder="Search global city..."
            placeholderTextColor={colors.textDim}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />

          {/* City Chips List */}
          <ScrollView style={styles.cityList} contentContainerStyle={styles.cityListContent}>
            <Text style={styles.sectionLabel}>GLOBAL HUBS</Text>
            <View style={styles.chipGrid}>
              {filteredCities.map((city) => {
                const isSelected = activeLocation?.name?.toLowerCase().includes(city.name.toLowerCase().split(',')[0]);

                return (
                  <TouchableOpacity
                    key={city.name}
                    onPress={() => updateLocationManually(city)}
                    activeOpacity={0.7}
                    style={[
                      styles.cityChip,
                      isSelected && styles.cityChipSelected
                    ]}
                  >
                    <Text
                      style={[
                        styles.cityChipText,
                        isSelected && styles.cityChipTextSelected
                      ]}
                    >
                      {city.name}
                    </Text>
                    {isSelected && <Check size={12} color={colors.primaryDark} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end'
  },
  modalSheet: {
    backgroundColor: colors.bgPrimary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: colors.borderCard
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textMain,
    fontFamily: fonts.bold
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.bgCardAlt,
    alignItems: 'center',
    justifyContent: 'center'
  },
  gpsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.bgHighlight,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    borderRadius: 16,
    paddingVertical: 12,
    marginBottom: 14
  },
  gpsBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
    fontFamily: fonts.bold
  },
  searchInput: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.borderCard,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.textMain,
    fontFamily: fonts.regular,
    marginBottom: 14
  },
  cityList: {
    maxHeight: 280
  },
  cityListContent: {
    paddingBottom: 20
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textDim,
    fontFamily: fonts.monoBold,
    letterSpacing: 1,
    marginBottom: 10
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  cityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.borderCard
  },
  cityChipSelected: {
    backgroundColor: colors.bgHighlight,
    borderColor: colors.primary
  },
  cityChipText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
    fontFamily: fonts.medium
  },
  cityChipTextSelected: {
    color: colors.primaryDark,
    fontWeight: '700',
    fontFamily: fonts.bold
  }
});
