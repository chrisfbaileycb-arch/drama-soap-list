import React, { memo } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useAppState';
import { Colors, Spacing, FontSize, Radius } from '@/constants/theme';

export const SearchBar = memo(() => {
  const { searchQuery, setSearchQuery } = useApp();
  return (
    <View style={styles.wrap}>
      <MaterialIcons name="search" size={18} color={Colors.textMuted} />
      <TextInput
        style={styles.inp}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search platforms, studios, specialties..."
        placeholderTextColor={Colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {searchQuery.length > 0 && (
        <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
          <MaterialIcons name="close" size={16} color={Colors.textMuted} />
        </Pressable>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.surface2,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md, paddingVertical: 10,
    marginHorizontal: Spacing.md, marginBottom: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  inp: { flex: 1, color: Colors.text, fontSize: FontSize.base, padding: 0 },
});
