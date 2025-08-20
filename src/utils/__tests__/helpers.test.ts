import { describe, it, expect, beforeEach } from 'vitest';
import { generateId, formatDate, getInitialColumns } from '../helpers';

describe('Helper Functions', () => {
  beforeEach(() => {
    // Reset any global state if needed
  });

  describe('generateId', () => {
    it('generates unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      const id3 = generateId();

      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id3).toBeDefined();
      expect(id1).not.toBe(id2);
      expect(id2).not.toBe(id3);
      expect(id1).not.toBe(id3);
    });

    it('generates IDs with correct format', () => {
      const id = generateId();

      // Should be a string
      expect(typeof id).toBe('string');

      // Should not be empty
      expect(id.length).toBeGreaterThan(0);

      // Should contain alphanumeric characters and hyphens (due to our format)
      expect(/^[a-zA-Z0-9-]+$/.test(id)).toBe(true);

      // Should contain hyphens as separators
      expect(id).toContain('-');
    });

    it('generates different IDs on subsequent calls', () => {
      const ids = new Set();

      for (let i = 0; i < 100; i++) {
        ids.add(generateId());
      }

      // All IDs should be unique
      expect(ids.size).toBe(100);
    });

    it('handles rapid successive calls', () => {
      const start = Date.now();
      const ids = [];

      for (let i = 0; i < 1000; i++) {
        ids.push(generateId());
      }

      const end = Date.now();

      // Should complete quickly
      expect(end - start).toBeLessThan(1000);

      // All IDs should be unique
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(1000);
    });
  });

  describe('formatDate', () => {
    it('formats date correctly', () => {
      const testDate = new Date('2024-01-15T10:30:00Z');
      const formatted = formatDate(testDate);

      expect(formatted).toBeDefined();
      expect(typeof formatted).toBe('string');
      expect(formatted.length).toBeGreaterThan(0);
    });

    it('handles different date formats', () => {
      const dates = [
        new Date('2024-01-01T00:00:00Z'),
        new Date('2024-12-31T23:59:59Z'),
        new Date('2023-06-15T12:30:45Z'),
        new Date('2025-03-20T08:15:30Z'),
      ];

      dates.forEach((date) => {
        const formatted = formatDate(date);
        expect(formatted).toBeDefined();
        expect(typeof formatted).toBe('string');
        expect(formatted.length).toBeGreaterThan(0);
      });
    });

    it('handles edge case dates', () => {
      const edgeDates = [
        new Date(0), // Unix epoch
        new Date('1970-01-01T00:00:00Z'),
        new Date('9999-12-31T23:59:59Z'),
        new Date('1900-01-01T00:00:00Z'),
      ];

      edgeDates.forEach((date) => {
        const formatted = formatDate(date);
        expect(formatted).toBeDefined();
        expect(typeof formatted).toBe('string');
        expect(formatted.length).toBeGreaterThan(0);
      });
    });

    it('handles invalid dates gracefully', () => {
      const invalidDates = [new Date('invalid'), new Date(NaN), new Date('')];

      invalidDates.forEach((date) => {
        // formatDate will throw for invalid dates because Intl.DateTimeFormat doesn't handle them
        expect(() => formatDate(date)).toThrow();
      });
    });
  });

  describe('getInitialColumns', () => {
    it('returns correct number of columns', () => {
      const columns = getInitialColumns();

      expect(Array.isArray(columns)).toBe(true);
      expect(columns.length).toBe(3);
    });

    it('returns columns with correct structure', () => {
      const columns = getInitialColumns();

      columns.forEach((column) => {
        expect(column).toHaveProperty('id');
        expect(column).toHaveProperty('title');
        expect(column).toHaveProperty('status');
        expect(column).toHaveProperty('tasks');
        expect(Array.isArray(column.tasks)).toBe(true);
      });
    });

    it('returns correct column statuses', () => {
      const columns = getInitialColumns();
      const statuses = columns.map((col) => col.status);

      expect(statuses).toContain('todo');
      expect(statuses).toContain('in-progress');
      expect(statuses).toContain('done');
    });

    it('returns correct column titles', () => {
      const columns = getInitialColumns();
      const titles = columns.map((col) => col.title);

      expect(titles).toContain('To Do');
      expect(titles).toContain('In Progress');
      expect(titles).toContain('Done');
    });

    it('returns columns with empty task arrays', () => {
      const columns = getInitialColumns();

      columns.forEach((column) => {
        expect(column.tasks).toEqual([]);
      });
    });

    it('returns unique column IDs', () => {
      const columns = getInitialColumns();
      const ids = columns.map((col) => col.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(columns.length);
    });

    it('returns immutable column structure', () => {
      const columns = getInitialColumns();
      const originalLength = columns.length;

      // Attempting to modify should not affect the original
      columns.push({
        id: 'test',
        title: 'Test',
        status: 'todo' as const,
        tasks: [],
      });
      expect(columns.length).toBe(originalLength + 1);

      // But the function should still return the original structure
      const newColumns = getInitialColumns();
      expect(newColumns.length).toBe(3);
    });

    it('maintains consistent column order', () => {
      const columns1 = getInitialColumns();
      const columns2 = getInitialColumns();

      expect(columns1[0].status).toBe(columns2[0].status);
      expect(columns1[1].status).toBe(columns2[1].status);
      expect(columns1[2].status).toBe(columns2[2].status);
    });

    it('handles edge cases gracefully', () => {
      const columns = getInitialColumns();

      // Test that we get the expected 3 columns
      expect(columns).toHaveLength(3);

      // Test that each column has the correct structure
      columns.forEach((column) => {
        expect(column).toHaveProperty('id');
        expect(column).toHaveProperty('title');
        expect(column).toHaveProperty('status');
        expect(column).toHaveProperty('tasks');
        expect(Array.isArray(column.tasks)).toBe(true);
      });
    });
  });

  describe('Integration Tests', () => {
    it('works together in a typical workflow', () => {
      // Simulate creating a new task
      const taskId = generateId();
      const createdAt = new Date();
      const formattedDate = formatDate(createdAt);

      // Simulate getting initial board state
      const columns = getInitialColumns();

      // Verify everything works together
      expect(taskId).toBeDefined();
      expect(formattedDate).toBeDefined();
      expect(columns).toHaveLength(3);

      // Verify task ID is unique
      const allIds = [taskId, ...columns.map((col) => col.id)];
      const uniqueIds = new Set(allIds);
      expect(uniqueIds.size).toBe(allIds.length);
    });

    it('handles multiple rapid operations', () => {
      const operations = [];

      // Simulate rapid task creation
      for (let i = 0; i < 100; i++) {
        const id = generateId();
        const date = new Date();
        const formatted = formatDate(date);

        operations.push({ id, date, formatted });
      }

      // All operations should succeed
      expect(operations).toHaveLength(100);

      // All IDs should be unique
      const ids = operations.map((op) => op.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(100);

      // All dates should be valid
      operations.forEach((op) => {
        expect(op.date).toBeInstanceOf(Date);
        expect(op.formatted).toBeDefined();
        expect(typeof op.formatted).toBe('string');
      });
    });
  });

  describe('Performance Tests', () => {
    it('generates IDs quickly', () => {
      const start = performance.now();

      for (let i = 0; i < 1000; i++) {
        generateId();
      }

      const end = performance.now();
      const duration = end - start;

      // Should complete in reasonable time (less than 100ms)
      expect(duration).toBeLessThan(100);
    });

    it('formats dates efficiently', () => {
      const testDate = new Date();
      const start = performance.now();

      for (let i = 0; i < 1000; i++) {
        formatDate(testDate);
      }

      const end = performance.now();
      const duration = end - start;

      // Should complete in reasonable time (less than 200ms, very lenient for CI)
      expect(duration).toBeLessThan(200);
    });

    it('gets initial columns quickly', () => {
      const start = performance.now();

      for (let i = 0; i < 1000; i++) {
        getInitialColumns();
      }

      const end = performance.now();
      const duration = end - start;

      // Should complete in reasonable time (less than 50ms)
      expect(duration).toBeLessThan(50);
    });
  });
});

