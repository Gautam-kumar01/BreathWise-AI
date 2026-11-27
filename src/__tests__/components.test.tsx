import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { AppProvider } from '../context/AppContext';
import { ToastProvider } from '../context/ToastContext';
import { Navbar } from '../components/layout/Navbar';
import { DiurnalCurveSection } from '../components/dashboard/DiurnalCurveSection';
import { ParticleSizeExplainer } from '../components/dashboard/ParticleSizeExplainer';
import { SEEDED_SCENARIOS } from '../data/scenarios';

describe('React Components - Layout & Navigation UI', () => {
  it('renders BreatheWise AI brand logo and title in Navbar', () => {
    render(
      <ToastProvider>
        <AppProvider>
          <Navbar />
        </AppProvider>
      </ToastProvider>
    );

    const brandTitles = screen.getAllByText(/BreatheWise/i);
    expect(brandTitles.length).toBeGreaterThan(0);
    expect(screen.getByText(/Urban Smog & Daily Routine Companion/i)).toBeInTheDocument();
  });

  it('renders all core navigation tabs with proper accessible buttons', () => {
    render(
      <ToastProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </ToastProvider>
    );

    expect(screen.getByRole('button', { name: /Air Intelligence/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /My Air Plan/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Indoor Defense/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cleaner Commute/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Impact & Habits/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Community Bulletin/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ask BreatheWise/i })).toBeInTheDocument();
  });
});

describe('React Components - Visualizers & Inversion Curve', () => {
  it('renders Diurnal Curve scrubber and hourly points without crashing', () => {
    const demoData = SEEDED_SCENARIOS.delhi_severe.data;
    render(
      <DiurnalCurveSection
        hourlyCurve={demoData.hourlyCurve}
        selectedHourIdx={0}
        onSelectHour={() => {}}
        scale="CPCB_INDIA"
        cleanestWindow={demoData.dailyForecastSummary.cleanestWindow}
        highestPeakWindow={demoData.dailyForecastSummary.highestPeakWindow}
      />
    );

    expect(screen.getByText(/24-Hour Diurnal Inversion Curve/i)).toBeInTheDocument();
    expect(screen.getByText(/Real-time smog wave simulation/i)).toBeInTheDocument();
    expect(screen.getByText(/Hour Verdict/i)).toBeInTheDocument();
  });

  it('renders Particle Size PM2.5 vs PM10 biological penetration explainer', () => {
    render(<ParticleSizeExplainer />);

    expect(screen.getByText(/Scientific Primer: What Are You Inhaling\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Particle Size & Lungs/i)).toBeInTheDocument();
    expect(screen.getByText(/Human Hair/i)).toBeInTheDocument();
  });
});
