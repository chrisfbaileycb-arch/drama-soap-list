import React, { memo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useApp } from '@/hooks/useAppState';
import { ContentFilter } from '@/contexts/AppContext';
import { Colors, Spacing, FontSize, Radius } from '@/constants/theme';

const FILTERS: ContentFilter[] = ['All', 'Romance', 'Drama', 'Thriller', 'Multi-Genre'];

export const GenreFilterBar = memo(() => {
  const { selectedFilter, setSelectedFilter } = useApp();
  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {FILTERS.map(f => {
          const on = selectedFilter === f;
          return (
            <Pressable
              key={f}
              style={[styles.chip, on && styles.chipOn]}
              onPress={() => setSelectedFilter(f)}
            >
              <Text style={[styles.chipTxt, on && styles.chipTxtOn]}>{f}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { marginBottom: Spacing.md },
  content: { paddingHorizontal: Spacing.md, gap: Spacing.sm, alignItems: 'center', paddingVertical: 4 },
  chip: {
    paddingHorizontal: Spacing.md, paddingVertical: 7,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface2,
    borderWidth: 1, borderColor: Colors.border,
  },
  chipOn: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipTxt: { color: Colors.textSubtle, fontSize: FontSize.sm, fontWeight: '600' },
  chipTxtOn: { color: '#FFFFFF' },
});
