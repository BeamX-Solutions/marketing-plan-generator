import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import PDFDocument from 'pdfkit';
import { Plan, BusinessContext } from '@/types';

const prisma = new PrismaClient();

// Define the expected params type explicitly
type RouteContext = {
  params: { id: string };
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const planId = context.params.id;

    // Fetch the plan from the database
    const dbPlan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!dbPlan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // Transform database plan to match Plan type
    const plan: Plan = {
      ...dbPlan,
      createdAt: dbPlan.createdAt instanceof Date ? dbPlan.createdAt.toISOString() : dbPlan.createdAt,
      updatedAt: dbPlan.updatedAt instanceof Date ? dbPlan.updatedAt.toISOString() : dbPlan.updatedAt,
      completedAt: dbPlan.completedAt instanceof Date || dbPlan.completedAt === null
        ? dbPlan.completedAt ? dbPlan.completedAt.toISOString() : undefined
        : dbPlan.completedAt,
      businessContext: typeof dbPlan.businessContext === 'string' 
        ? JSON.parse(dbPlan.businessContext) as BusinessContext
        : dbPlan.businessContext,
      questionnaireResponses: typeof dbPlan.questionnaireResponses === 'string'
        ? JSON.parse(dbPlan.questionnaireResponses)
        : dbPlan.questionnaireResponses,
      claudeAnalysis: dbPlan.claudeAnalysis 
        ? (typeof dbPlan.claudeAnalysis === 'string' 
           ? JSON.parse(dbPlan.claudeAnalysis) 
           : dbPlan.claudeAnalysis)
        : null,
      generatedContent: dbPlan.generatedContent 
        ? (typeof dbPlan.generatedContent === 'string' 
           ? JSON.parse(dbPlan.generatedContent) 
           : dbPlan.generatedContent)
        : null,
      planMetadata: dbPlan.planMetadata 
        ? (typeof dbPlan.planMetadata === 'string' 
           ? JSON.parse(dbPlan.planMetadata) 
           : dbPlan.planMetadata)
        : null,
      status: dbPlan.status as "in_progress" | "analyzing" | "generating" | "completed" | "failed",
    };

    // Generate PDF
    const pdfBuffer = await generatePDF(plan);

    // Ensure pdfBuffer is passed correctly to NextResponse
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="marketing-plan-${planId}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: `Failed to download plan: ${error.message}` },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

async function generatePDF(plan: Plan): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    // Convert createdAt to Date if it's a string
    const creationDate = typeof plan.createdAt === 'string' ? new Date(plan.createdAt) : plan.createdAt;

    // Validate the date
    if (isNaN(creationDate.getTime())) {
      reject(new Error('Invalid createdAt date'));
      return;
    }

    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: `Marketing Plan ${plan.id}`,
        Author: 'Marketing Plan Generator',
        CreationDate: creationDate,
      },
    });
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    // Parse generatedContent if it's a string
    let generatedContent: Plan['generatedContent'];
    try {
      generatedContent = typeof plan.generatedContent === 'string'
        ? JSON.parse(plan.generatedContent)
        : plan.generatedContent;
    } catch (error) {
      reject(new Error('Failed to parse generatedContent'));
      return;
    }

    if (!generatedContent || typeof generatedContent === 'string') {
      reject(new Error('No valid generated content available'));
      return;
    }

    const { onePagePlan, implementationGuide, strategicInsights } = generatedContent;

    // Title
    doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .text('Marketing Plan', { align: 'center' })
      .fontSize(14)
      .font('Helvetica')
      .text(`Plan ID: ${plan.id}`, { align: 'center' })
      .text(`Generated on: ${creationDate.toLocaleDateString()}`, { align: 'center' })
      .moveDown(2);

    // One-Page Plan
    doc
      .fontSize(18)
      .font('Helvetica-Bold')
      .text('One-Page Marketing Plan')
      .moveDown();

    // Before Section
    doc
      .fontSize(14)
      .fillColor('blue')
      .text('BEFORE (Prospects)')
      .fillColor('black')
      .moveDown(0.5);
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Target Market: ')
      .font('Helvetica')
      .text(onePagePlan.before.targetMarket, { indent: 20 })
      .moveDown(0.5);
    doc
      .font('Helvetica-Bold')
      .text('Message: ')
      .font('Helvetica')
      .text(onePagePlan.before.message, { indent: 20 })
      .moveDown(0.5);
    doc
      .font('Helvetica-Bold')
      .text('Media: ')
      .moveDown(0.5);
    onePagePlan.before.media.forEach((channel, index) => {
      doc
        .font('Helvetica')
        .text(`${index + 1}. ${channel}`, { indent: 30 })
        .moveDown(0.3);
    });
    doc.moveDown();

    // During Section
    doc
      .fontSize(14)
      .fillColor('green')
      .text('DURING (Leads)')
      .fillColor('black')
      .moveDown(0.5);
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Lead Capture: ')
      .font('Helvetica')
      .text(onePagePlan.during.leadCapture, { indent: 20 })
      .moveDown(0.5);
    doc
      .font('Helvetica-Bold')
      .text('Lead Nurture: ')
      .font('Helvetica')
      .text(onePagePlan.during.leadNurture, { indent: 20 })
      .moveDown(0.5);
    doc
      .font('Helvetica-Bold')
      .text('Sales Conversion: ')
      .font('Helvetica')
      .text(onePagePlan.during.salesConversion, { indent: 20 })
      .moveDown();

    // After Section
    doc
      .fontSize(14)
      .fillColor('purple')
      .text('AFTER (Customers)')
      .fillColor('black')
      .moveDown(0.5);
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Deliver Experience: ')
      .font('Helvetica')
      .text(onePagePlan.after.deliverExperience, { indent: 20 })
      .moveDown(0.5);
    doc
      .font('Helvetica-Bold')
      .text('Lifetime Value: ')
      .font('Helvetica')
      .text(onePagePlan.after.lifetimeValue, { indent: 20 })
      .moveDown(0.5);
    doc
      .font('Helvetica-Bold')
      .text('Referrals: ')
      .font('Helvetica')
      .text(onePagePlan.after.referrals, { indent: 20 })
      .moveDown();

    // Implementation Guide
    doc
      .addPage()
      .fontSize(18)
      .font('Helvetica-Bold')
      .text('Implementation Guide')
      .moveDown();
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Executive Summary: ')
      .font('Helvetica')
      .text(implementationGuide.executiveSummary, { indent: 20 })
      .moveDown();
    doc
      .font('Helvetica-Bold')
      .text('Phase 1 (First 30 Days): ')
      .font('Helvetica')
      .text(implementationGuide.actionPlans.phase1, { indent: 20 })
      .moveDown();
    doc
      .font('Helvetica-Bold')
      .text('Phase 2 (Days 31-90): ')
      .font('Helvetica')
      .text(implementationGuide.actionPlans.phase2, { indent: 20 })
      .moveDown();
    doc
      .font('Helvetica-Bold')
      .text('Phase 3 (Days 91-180): ')
      .font('Helvetica')
      .text(implementationGuide.actionPlans.phase3, { indent: 20 })
      .moveDown();

    // Strategic Insights
    doc
      .addPage()
      .fontSize(18)
      .font('Helvetica-Bold')
      .text('Strategic Insights')
      .moveDown();
    doc
      .fontSize(12)
      .fillColor('green')
      .text('Strengths: ')
      .fillColor('black')
      .moveDown(0.5);
    strategicInsights.strengths.forEach((strength, index) => {
      doc
        .font('Helvetica')
        .text(`${index + 1}. ${strength}`, { indent: 20 })
        .moveDown(0.3);
    });
    doc.moveDown(0.5);
    doc
      .fillColor('blue')
      .text('Opportunities: ')
      .fillColor('black')
      .moveDown(0.5);
    strategicInsights.opportunities.forEach((opportunity, index) => {
      doc
        .font('Helvetica')
        .text(`${index + 1}. ${opportunity}`, { indent: 20 })
        .moveDown(0.3);
    });
    doc.moveDown(0.5);
    doc
      .fillColor('red')
      .text('Key Risks: ')
      .fillColor('black')
      .moveDown(0.5);
    strategicInsights.risks.forEach((risk, index) => {
      doc
        .font('Helvetica')
        .text(`${index + 1}. ${risk}`, { indent: 20 })
        .moveDown(0.3);
    });

    doc.end();
  });
}