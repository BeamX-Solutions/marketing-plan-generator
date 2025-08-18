'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import QuestionnaireStep from '@/components/questionnaire/QuestionnaireStep';
import ProgressBar from '@/components/questionnaire/ProgressBar';
import { BUSINESS_CONTEXT_QUESTIONS, QUESTIONNAIRE_QUESTIONS } from '@/constants/questionnaire';
import { BusinessContext, Question } from '@/types';
import { analytics } from '@/lib/analytics/analyticsService';

const QuestionnairePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentSquare, setCurrentSquare] = useState(0);
  const [responses, setResponses] = useState<Record<string, string | string[] | number | boolean>>({});
  const [completedSquares, setCompletedSquares] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [startTime] = useState<number>(Date.now());

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && session?.user?.email) {
      analytics.trackQuestionnaireStart(
        session.user.email,
        typeof responses['industry'] === 'string' ? responses['industry'] : undefined
      );
      analytics.identify(session.user.email, {
        business_name: session.user.name || 'Unknown'
      });
    }
  }, [status, router, session, responses]);

  const allQuestions: Question[] = [
    ...BUSINESS_CONTEXT_QUESTIONS,
    ...QUESTIONNAIRE_QUESTIONS
  ];

  const currentQuestion = allQuestions[currentQuestionIndex];
  
  useEffect(() => {
    if (currentQuestion) {
      setCurrentSquare(currentQuestion.square);
    }
  }, [currentQuestion]);

  const handleResponseChange = (value: string | string[] | number | boolean) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));

    const updatedResponses = { ...responses, [currentQuestion.id]: value };
    localStorage.setItem('questionnaire_responses', JSON.stringify(updatedResponses));
  };

  const handleNext = async () => {
    if (session?.user?.email) {
      analytics.trackQuestionnaireProgress(
        session.user.email,
        currentQuestion.square,
        currentQuestionIndex,
        allQuestions.length
      );
    }

    const nextQuestion = allQuestions[currentQuestionIndex + 1];
    if (nextQuestion && nextQuestion.square !== currentQuestion.square) {
      setCompletedSquares(prev => {
        if (!prev.includes(currentQuestion.square)) {
          return [...prev, currentQuestion.square];
        }
        return prev;
      });
    }

    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      const completionTime = Date.now() - startTime;
      if (session?.user?.email) {
        analytics.trackQuestionnaireCompleted(
          session.user.email,
          completionTime,
          typeof responses['industry'] === 'string' ? responses['industry'] : undefined,
          typeof responses['business-model'] === 'string' ? responses['business-model'] : undefined
        );
      }
      await generateMarketingPlan();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const generateMarketingPlan = async () => {
    setIsGenerating(true);
    const generationStartTime = Date.now();
    
    try {
      const businessContext: Partial<BusinessContext> = {
        industry: typeof responses['industry'] === 'string' ? responses['industry'] : undefined,
        businessModel: typeof responses['business-model'] === 'string' &&
          ['B2B', 'B2C', 'B2B2C', 'Marketplace'].includes(responses['business-model'])
          ? responses['business-model'] as 'B2B' | 'B2C' | 'B2B2C' | 'Marketplace'
          : undefined,
        companySize: typeof responses['company-size'] === 'string'
          ? responses['company-size']
          : typeof responses['company-size'] === 'number'
            ? String(responses['company-size'])
            : undefined,
        yearsInOperation: typeof responses['years-in-operation'] === 'string'
          ? responses['years-in-operation']
          : typeof responses['years-in-operation'] === 'number'
            ? String(responses['years-in-operation'])
            : undefined,
        geographicScope: typeof responses['geographic-scope'] === 'string'
          ? responses['geographic-scope']
          : typeof responses['geographic-scope'] === 'number'
            ? String(responses['geographic-scope'])
            : undefined,
        primaryChallenges: Array.isArray(responses['primary-challenges'])
          ? responses['primary-challenges'] as string[]
          : undefined,
        marketingMaturity: 
          responses['marketing-maturity'] === 'beginner' ||
          responses['marketing-maturity'] === 'intermediate' ||
          responses['marketing-maturity'] === 'advanced'
            ? responses['marketing-maturity']
            : undefined,
        marketingBudget: typeof responses['marketing-budget'] === 'string'
          ? responses['marketing-budget']
          : typeof responses['marketing-budget'] === 'number'
            ? String(responses['marketing-budget'])
            : undefined,
        timeAvailability: typeof responses['time-availability'] === 'string'
          ? responses['time-availability']
          : typeof responses['time-availability'] === 'number'
            ? String(responses['time-availability'])
            : undefined,
        businessGoals: Array.isArray(responses['business-goals'])
          ? responses['business-goals'] as string[]
          : undefined
      };

      const planResponse = await fetch('/api/plans/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessContext,
          questionnaireResponses: responses
        })
      });

      if (!planResponse.ok) {
        throw new Error('Failed to create plan');
      }

      const plan = await planResponse.json();
      
      if (session?.user?.email) {
        analytics.trackPlanGenerationStarted(session.user.email, plan.id);
      }
      
      const generateResponse = await fetch(`/api/plans/${plan.id}/generate`, {
        method: 'POST'
      });

      if (!generateResponse.ok) {
        throw new Error('Failed to generate plan');
      }

      const generationTime = Date.now() - generationStartTime;

      if (session?.user?.email) {
        analytics.trackPlanGenerationCompleted(
          session.user.email, 
          plan.id, 
          generationTime
        );
      }

      router.push(`/plan/${plan.id}`);
    } catch (error) {
      console.error('Error generating plan:', error);
      
      if (session?.user?.email) {
        analytics.trackPlanGenerationFailed(
          session.user.email, 
          undefined,
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
      
      alert('Failed to generate marketing plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('questionnaire_responses');
    if (saved) {
      try {
        setResponses(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved responses:', error);
      }
    }
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Generating Your Marketing Plan
          </h2>
          <p className="text-gray-600">
            Claude AI is analyzing your responses and creating your personalized marketing strategy...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProgressBar
        currentSquare={currentSquare}
        currentQuestion={currentQuestionIndex}
        totalQuestions={allQuestions.length}
        completedSquares={completedSquares}
      />

      <div className="py-8">
        <QuestionnaireStep
          question={currentQuestion}
          value={responses[currentQuestion?.id]}
          onChange={handleResponseChange}
          onNext={handleNext}
          onPrev={handlePrev}
          canGoNext={currentQuestionIndex < allQuestions.length - 1}
          canGoPrev={currentQuestionIndex > 0}
          isFirst={currentQuestionIndex === 0}
          isLast={currentQuestionIndex === allQuestions.length - 1}
        />
      </div>

      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg text-xs">
          <div>Question: {currentQuestionIndex + 1} / {allQuestions.length}</div>
          <div>Square: {currentSquare}</div>
          <div>ID: {currentQuestion?.id}</div>
        </div>
      )}
    </div>
  );
};

export default QuestionnairePage;