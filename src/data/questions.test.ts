import { describe, it, expect } from 'vitest';
import { questionsData, QuestionData } from './questions';

describe('Questions Data', () => {
  it('should have questions data defined', () => {
    expect(questionsData).toBeDefined();
    expect(Object.keys(questionsData).length).toBeGreaterThan(0);
  });

  it('should have valid question structure for Two Sum', () => {
    const twoSum = questionsData[1];
    
    expect(twoSum).toBeDefined();
    expect(twoSum.id).toBe(1);
    expect(twoSum.title).toBe('Two Sum');
    expect(twoSum.difficulty).toBe('Easy');
    expect(twoSum.tags).toContain('Array');
    expect(twoSum.hasVisualization).toBe(true);
  });

  it('should have all required fields for each question', () => {
    Object.values(questionsData).forEach((question: QuestionData) => {
      expect(question.id).toBeDefined();
      expect(question.title).toBeDefined();
      expect(question.description).toBeDefined();
      expect(question.examples).toBeDefined();
      expect(question.examples.length).toBeGreaterThan(0);
      expect(question.codes).toBeDefined();
      expect(question.codes.Python).toBeDefined();
      expect(question.codes.JavaScript).toBeDefined();
      expect(question.explanation).toBeDefined();
      expect(question.tags).toBeDefined();
      expect(question.difficulty).toMatch(/^(Easy|Medium|Hard)$/);
      expect(question.topic).toBeDefined();
    });
  });

  it('should have valid examples with input and output', () => {
    Object.values(questionsData).forEach((question: QuestionData) => {
      question.examples.forEach((example) => {
        expect(example.input).toBeDefined();
        expect(example.output).toBeDefined();
      });
    });
  });

  it('should have valid time and space complexity', () => {
    Object.values(questionsData).forEach((question: QuestionData) => {
      expect(question.explanation.timeComplexity).toBeDefined();
      expect(question.explanation.spaceComplexity).toBeDefined();
    });
  });
});

