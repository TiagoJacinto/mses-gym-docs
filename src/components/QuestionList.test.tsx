import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuestionList from '../components/QuestionList';

const mockQuestions = [
  {
    id: 1,
    pergunta: 'Question One Text',
    resposta: 'Answer One Content',
    dicas: 'Tip One Content',
    referencia: 'Reference One Content',
  },
  {
    id: 2,
    pergunta: 'Question Two Text',
    resposta: 'Answer Two Content',
    dicas: 'Tip Two Content',
    referencia: 'Reference Two Content',
  },
];

describe('QuestionList', () => {
  describe('rendering', () => {
    it('renders all questions', () => {
      render(<QuestionList questions={mockQuestions} />);
      expect(screen.getAllByText('Question One Text')).toHaveLength(1);
      expect(screen.getAllByText('Question Two Text')).toHaveLength(1);
    });

    it('displays correct question numbers', () => {
      render(<QuestionList questions={mockQuestions} />);
      const numbers = screen.getAllByText(/\d+/);
      expect(numbers[0]).toHaveTextContent('1');
      expect(numbers[1]).toHaveTextContent('2');
    });

    it('has three buttons per question (Resposta, Dicas, Referencia)', () => {
      render(<QuestionList questions={mockQuestions} />);
      const respostaButtons = screen.getAllByRole('button', { name: 'Resposta' });
      const dicasButtons = screen.getAllByRole('button', { name: 'Dicas' });
      const referenciaButtons = screen.getAllByRole('button', { name: 'Referência' });

      expect(respostaButtons).toHaveLength(2);
      expect(dicasButtons).toHaveLength(2);
      expect(referenciaButtons).toHaveLength(2);
    });

    it('has 20 Resposta buttons for 20 questions', () => {
      const twentyQuestions = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        pergunta: `Question ${i + 1}`,
        resposta: `Answer ${i + 1}`,
        dicas: `Tip ${i + 1}`,
        referencia: `Ref ${i + 1}`,
      }));

      render(<QuestionList questions={twentyQuestions} />);
      expect(screen.getAllByRole('button', { name: 'Resposta' })).toHaveLength(20);
    });
  });

  describe('accordion behavior', () => {
    it('clicking Resposta reveals answer content', () => {
      render(<QuestionList questions={mockQuestions} />);
      const respostaBtn = screen.getAllByRole('button', { name: 'Resposta' })[0];

      fireEvent.click(respostaBtn);

      const answerContent = document.querySelector('.answer-content.open');
      expect(answerContent).toBeTruthy();
    });

    it('clicking Dicas reveals dicas content', () => {
      render(<QuestionList questions={mockQuestions} />);
      const dicasBtn = screen.getAllByRole('button', { name: 'Dicas' })[0];

      fireEvent.click(dicasBtn);

      const dicasContent = document.querySelector('.dicas-content.open');
      expect(dicasContent).toBeTruthy();
    });

    it('clicking Referencia reveals reference content', () => {
      render(<QuestionList questions={mockQuestions} />);
      const refBtn = screen.getAllByRole('button', { name: 'Referência' })[0];

      fireEvent.click(refBtn);

      const refContent = document.querySelector('.referencia-content.open');
      expect(refContent).toBeTruthy();
    });

    it('clicking same button again closes content', () => {
      render(<QuestionList questions={mockQuestions} />);
      const respostaBtn = screen.getAllByRole('button', { name: 'Resposta' })[0];

      // Open
      fireEvent.click(respostaBtn);
      const openAnswerAfterOpen = document.querySelector('.answer-content.open');
      expect(openAnswerAfterOpen).toBeTruthy();

      // Close
      fireEvent.click(respostaBtn);
      const openAnswerAfterClose = document.querySelector('.answer-content.open');
      expect(openAnswerAfterClose).toBeFalsy();
    });

    it('clicking different button closes previous and opens new', () => {
      render(<QuestionList questions={mockQuestions} />);
      const respostaBtn = screen.getAllByRole('button', { name: 'Resposta' })[0];
      const dicasBtn = screen.getAllByRole('button', { name: 'Dicas' })[0];

      // Open answer
      fireEvent.click(respostaBtn);
      expect(document.querySelector('.answer-content.open')).toBeTruthy();
      expect(document.querySelector('.dicas-content.open')).toBeFalsy();

      // Open dicas (closes answer)
      fireEvent.click(dicasBtn);
      expect(document.querySelector('.dicas-content.open')).toBeTruthy();
      expect(document.querySelector('.answer-content.open')).toBeFalsy();
    });
  });

  describe('content verification', () => {
    it('answer content contains expected text', () => {
      render(<QuestionList questions={mockQuestions} />);
      const respostaBtn = screen.getAllByRole('button', { name: 'Resposta' })[0];

      fireEvent.click(respostaBtn);

      const answerContent = document.querySelector('.answer-content.open');
      expect(answerContent?.textContent).toContain('Answer One Content');
    });

    it('dicas content contains expected text', () => {
      render(<QuestionList questions={mockQuestions} />);
      const dicasBtn = screen.getAllByRole('button', { name: 'Dicas' })[0];

      fireEvent.click(dicasBtn);

      const dicasContent = document.querySelector('.dicas-content.open');
      expect(dicasContent?.textContent).toContain('Tip One Content');
    });

    it('referencia content contains expected text', () => {
      render(<QuestionList questions={mockQuestions} />);
      const refBtn = screen.getAllByRole('button', { name: 'Referência' })[0];

      fireEvent.click(refBtn);

      const refContent = document.querySelector('.referencia-content.open');
      expect(refContent?.textContent).toContain('Reference One Content');
    });

    it('blocks have block-label indicating type', () => {
      render(<QuestionList questions={mockQuestions} />);
      const respostaBtn = screen.getAllByRole('button', { name: 'Resposta' })[0];

      fireEvent.click(respostaBtn);

      const answerBlock = document.querySelector('.answer-content.open');
      expect(answerBlock?.textContent).toContain('Resposta');
    });
  });

  describe('button active state', () => {
    it('Resposta button has active class when open', () => {
      render(<QuestionList questions={mockQuestions} />);
      const respostaBtn = screen.getAllByRole('button', { name: 'Resposta' })[0];

      fireEvent.click(respostaBtn);

      expect(respostaBtn.closest('.btn-resposta')).toHaveClass('active');
    });

    it('Dicas button has active class when open', () => {
      render(<QuestionList questions={mockQuestions} />);
      const dicasBtn = screen.getAllByRole('button', { name: 'Dicas' })[0];

      fireEvent.click(dicasBtn);

      expect(dicasBtn.closest('.btn-dicas')).toHaveClass('active');
    });

    it('Referencia button has active class when open', () => {
      render(<QuestionList questions={mockQuestions} />);
      const refBtn = screen.getAllByRole('button', { name: 'Referência' })[0];

      fireEvent.click(refBtn);

      expect(refBtn.closest('.btn-referencia')).toHaveClass('active');
    });
  });

  describe('first and last question', () => {
    it('first question has correct content when opened', () => {
      const questions = [
        {
          id: 1,
          pergunta: 'First question text',
          resposta: 'First answer content',
          dicas: 'First dicas',
          referencia: 'First ref',
        },
      ];

      render(<QuestionList questions={questions} />);
      const respostaBtn = screen.getByRole('button', { name: 'Resposta' });

      fireEvent.click(respostaBtn);

      const answerContent = document.querySelector('.answer-content.open');
      expect(answerContent?.textContent).toContain('First answer content');
    });

    it('last question content is preserved', () => {
      const questions = [
        {
          id: 1,
          pergunta: 'First',
          resposta: 'First answer',
          dicas: 'First tips',
          referencia: 'First reference',
        },
        {
          id: 2,
          pergunta: 'Last question',
          resposta: 'Last answer contains RF-24 and RF-23',
          dicas: 'privilégio tip',
          referencia: 'OWASP reference',
        },
      ];

      render(<QuestionList questions={questions} />);
      const lastQuestion = document.querySelectorAll('.question-item')[1];
      const lastRespostaBtn = lastQuestion.querySelector('.btn-resposta');

      fireEvent.click(lastRespostaBtn!);

      const answerContent = lastQuestion.querySelector('.answer-content.open');
      expect(answerContent?.textContent).toContain('RF-24');
      expect(answerContent?.textContent).toContain('RF-23');
    });
  });

  describe('empty state', () => {
    it('handles empty questions array', () => {
      render(<QuestionList questions={[]} />);
      expect(screen.queryByRole('button', { name: 'Resposta' })).toBeNull();
    });
  });
});