import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Check, Home, Users, Briefcase, Dumbbell, DollarSign } from 'lucide-react';
import { HouseholdProfile, CommuteMode, ExercisePreference } from '../../types/user';

export const ProfileDrawer: React.FC = () => {
  const { isProfileDrawerOpen, setIsProfileDrawerOpen, userPreferences, updatePreferences, language } = useApp();

  if (!isProfileDrawerOpen) return null;

  const isHi = language === 'hi';

  const householdOptions: { id: HouseholdProfile; label: string; hiLabel: string }[] = [
    { id: 'family_with_kids', label: 'Family with School-Going Kids', hiLabel: 'स्कूली बच्चों वाला परिवार' },
    { id: 'elderly_household', label: 'Household with Seniors (60+)', hiLabel: 'बुजुर्गों वाला परिवार (६०+)' },
    { id: 'sensitive_asthma', label: 'Sensitive / Respiratory History', hiLabel: 'सांस या अस्थमा संवेदनशील' },
    { id: 'individual', label: 'Solo Working Professional', hiLabel: 'अकेले रहने वाले पेशेवर' },
    { id: 'student_shared', label: 'Student / Shared Apartment', hiLabel: 'छात्र / साझा आवास' }
  ];

  const commuteOptions: { id: CommuteMode; label: string }[] = [
    { id: 'metro_transit', label: 'Metro Rail (Air-conditioned)' },
    { id: 'two_wheeler', label: 'Two-Wheeler (Bike / Scooter)' },
    { id: 'auto_rickshaw', label: 'Auto-Rickshaw (Open CNG)' },
    { id: 'ac_car_cab', label: 'Car / AC Cab (Recirculating)' },
    { id: 'walking_biking', label: 'Walking / Bicycle' }
  ];

  const exerciseOptions: { id: ExercisePreference; label: string }[] = [
    { id: 'morning_outdoor', label: 'Early Morning Outdoor (6 AM - 8 AM)' },
    { id: 'evening_outdoor', label: 'Evening Outdoor (6 PM - 8 PM)' },
    { id: 'indoor_gym', label: 'Indoor Gym / Home Workouts' },
    { id: 'none', label: 'No regular outdoor workout' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/40 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white border-l border-warm-200 h-full flex flex-col shadow-warm-xl p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-warm-200">
          <div>
            <h2 className="text-lg font-bold text-stone-900 font-serif">
              {isHi ? 'व्यक्तिगत सेटिंग्स' : 'Personalization & Household'}
            </h2>
            <p className="text-xs text-stone-500">
              {isHi ? 'सलाह को अपने घर और दिनचर्या के अनुसार ढालें' : 'Tailor air advice to your daily routine & constraints'}
            </p>
          </div>
          <button
            onClick={() => setIsProfileDrawerOpen(false)}
            className="p-1 rounded-xl hover:bg-warm-100 text-stone-400 hover:text-stone-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 space-y-6 flex-1">
          {/* Household Context */}
          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-orange-700" />
              {isHi ? 'परिवार का प्रकार' : 'Household Composition'}
            </label>
            <div className="space-y-2">
              {householdOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => updatePreferences({ household: opt.id })}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition flex items-center justify-between shadow-sm ${
                    userPreferences.household === opt.id
                      ? 'bg-amber-50 border-orange-400 text-orange-950 font-bold'
                      : 'bg-white border-warm-200 text-stone-600 hover:border-warm-300'
                  }`}
                >
                  <span>{isHi ? opt.hiLabel : opt.label}</span>
                  {userPreferences.household === opt.id && <Check className="w-4 h-4 text-orange-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Commute Mode */}
          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-2 mb-2">
              <Briefcase className="w-4 h-4 text-orange-700" />
              {isHi ? 'प्राथमिक यात्रा साधन' : 'Primary Commute Mode'}
            </label>
            <div className="space-y-2">
              {commuteOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => updatePreferences({ primaryCommute: opt.id })}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition flex items-center justify-between shadow-sm ${
                    userPreferences.primaryCommute === opt.id
                      ? 'bg-amber-50 border-orange-400 text-orange-950 font-bold'
                      : 'bg-white border-warm-200 text-stone-600 hover:border-warm-300'
                  }`}
                >
                  <span>{opt.label}</span>
                  {userPreferences.primaryCommute === opt.id && <Check className="w-4 h-4 text-orange-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Outdoor Activity Schedule */}
          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-2 mb-2">
              <Dumbbell className="w-4 h-4 text-orange-700" />
              {isHi ? 'व्यायाम / सैर की आदत' : 'Outdoor Exercise Habit'}
            </label>
            <div className="space-y-2">
              {exerciseOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => updatePreferences({ exercisePreference: opt.id })}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition flex items-center justify-between shadow-sm ${
                    userPreferences.exercisePreference === opt.id
                      ? 'bg-amber-50 border-orange-400 text-orange-950 font-bold'
                      : 'bg-white border-warm-200 text-stone-600 hover:border-warm-300'
                  }`}
                >
                  <span>{opt.label}</span>
                  {userPreferences.exercisePreference === opt.id && <Check className="w-4 h-4 text-orange-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Home Setup & Equipment Context */}
          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-2 mb-2">
              <Home className="w-4 h-4 text-orange-700" />
              {isHi ? 'घर की व्यवस्था' : 'Indoor Setup'}
            </label>
            <div className="space-y-2.5 bg-warm-50 p-4 rounded-2xl border border-warm-200">
              <label className="flex items-center justify-between text-xs text-stone-700 font-medium cursor-pointer">
                <span>Own an Electric Air Purifier</span>
                <input
                  type="checkbox"
                  checked={userPreferences.hasAirPurifier}
                  onChange={(e) => updatePreferences({ hasAirPurifier: e.target.checked })}
                  className="rounded text-amber-600 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-stone-700 font-medium cursor-pointer pt-2 border-t border-warm-200">
                <span>Kitchen has Working Exhaust Fan / Chimney</span>
                <input
                  type="checkbox"
                  checked={userPreferences.hasKitchenExhaust}
                  onChange={(e) => updatePreferences({ hasKitchenExhaust: e.target.checked })}
                  className="rounded text-amber-600 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-stone-700 font-medium cursor-pointer pt-2 border-t border-warm-200">
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
                  Prioritize Zero-Cost & DIY Hacks
                </span>
                <input
                  type="checkbox"
                  checked={userPreferences.budgetConscious}
                  onChange={(e) => updatePreferences({ budgetConscious: e.target.checked })}
                  className="rounded text-amber-600 focus:ring-0"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-warm-200">
          <button
            onClick={() => setIsProfileDrawerOpen(false)}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 font-bold text-white text-xs shadow-warm-md transition"
          >
            {isHi ? 'सेव करें और योजना देखें' : 'Save & Update My Day Plan'}
          </button>
        </div>
      </div>
    </div>
  );
};
