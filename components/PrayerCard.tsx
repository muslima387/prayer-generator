
import React, { useState, useCallback } from 'react';
import { PrayerCategory } from '../types';
import { generatePrayer } from '../services/prayerService';
import { generatePrayerImage } from '../services/imageService';
import { requestNotificationPermission, setDailyReminder, cancelDailyReminder, getReminderStatus } from '../services/notificationService';
import { DownloadIcon, ShareIcon, BellIcon, BellOffIcon } from './icons/Icons';

interface PrayerCardProps {
    selectedBg: string;
}

const PrayerCard: React.FC<PrayerCardProps> = ({ selectedBg }) => {
  const [name, setName] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<PrayerCategory>(PrayerCategory.Love);
  const [generatedPrayer, setGeneratedPrayer] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reminderStatus, setReminderStatus] = useState(getReminderStatus());

  const handleGenerateClick = () => {
    if (!name.trim()) {
      alert('الرجاء إدخال اسم.');
      return;
    }
    const prayer = generatePrayer(name, selectedCategory);
    setGeneratedPrayer(prayer);
  };

  const handleSaveImage = useCallback(async () => {
    if (!generatedPrayer) return;
    setIsLoading(true);
    try {
      const dataUrl = await generatePrayerImage(selectedBg, generatedPrayer);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `dua-for-${name}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('حدث خطأ أثناء إنشاء الصورة.');
    } finally {
      setIsLoading(false);
    }
  }, [generatedPrayer, selectedBg, name]);

  const handleShare = useCallback(async () => {
    if (!generatedPrayer) return;

    if (!navigator.share) {
        alert('المشاركة غير مدعومة في هذا المتصفح. يمكنك حفظ الصورة ومشاركتها يدويًا.');
        return;
    }
    
    setIsLoading(true);
    try {
        const dataUrl = await generatePrayerImage(selectedBg, generatedPrayer);
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], `dua-for-${name}.png`, { type: blob.type });

        await navigator.share({
            title: `دعاء لـ ${name}`,
            text: generatedPrayer,
            files: [file],
        });
    } catch (error) {
        console.error('Error sharing:', error);
    } finally {
        setIsLoading(false);
    }
}, [generatedPrayer, selectedBg, name]);

  const handleReminderToggle = async () => {
    if (reminderStatus?.enabled) {
        cancelDailyReminder();
        setReminderStatus(getReminderStatus());
    } else {
        if (!name.trim()) {
            alert('الرجاء إدخال اسم لتفعيل التذكير.');
            return;
        }
        const permission = await requestNotificationPermission();
        if (permission === 'granted') {
            setDailyReminder(name);
            setReminderStatus(getReminderStatus());
        }
    }
  };


  const CategoryButton = ({ category, emoji }: { category: PrayerCategory, emoji: string }) => (
    <button
      onClick={() => setSelectedCategory(category)}
      className={`flex-1 p-3 text-sm sm:text-base rounded-lg transition-all duration-300 transform hover:scale-105 ${
        selectedCategory === category
          ? 'bg-yellow-300 text-gray-800 shadow-lg'
          : 'bg-white/60 hover:bg-white/90 text-gray-700'
      }`}
    >
      {emoji} {category}
    </button>
  );

  return (
    <div className="w-full max-w-lg bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
      <div>
        <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
          ادعُ لمن تحب
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اكتب الاسم هنا..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors"
        />
      </div>
      
      <div>
        <label className="block text-lg font-medium text-gray-700 mb-3">اختر نوع الدعاء</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 text-center">
            <CategoryButton category={PrayerCategory.Love} emoji="🤍" />
            <CategoryButton category={PrayerCategory.Healing} emoji="🌸" />
            <CategoryButton category={PrayerCategory.Success} emoji="🌞" />
            <CategoryButton category={PrayerCategory.Peace} emoji="🌿" />
            <CategoryButton category={PrayerCategory.Blessing} emoji="🌼" />
            <div className="sm:col-span-1"></div>
        </div>
      </div>

      <button
        onClick={handleGenerateClick}
        className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
      >
        ولّد دعاءً
      </button>
      
      {generatedPrayer && (
        <div className="border-t border-gray-300 pt-6 space-y-4">
          <p className="text-center text-xl p-4 bg-yellow-50 rounded-lg text-gray-800 leading-relaxed" style={{whiteSpace: 'pre-wrap'}}>
            {generatedPrayer}
          </p>
          <div className="flex justify-center items-center gap-4">
            <button onClick={handleSaveImage} disabled={isLoading} className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400">
                <DownloadIcon /> {isLoading ? 'جاري الإنشاء...' : 'حفظ كصورة'}
            </button>
            <button onClick={handleShare} disabled={isLoading} className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400">
                <ShareIcon /> مشاركة
            </button>
             <button onClick={handleReminderToggle} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${reminderStatus?.enabled ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500 hover:bg-gray-600'} text-white`}>
                {reminderStatus?.enabled ? <BellOffIcon /> : <BellIcon />}
                <span>{reminderStatus?.enabled ? 'إلغاء التذكير' : 'تذكير يومي'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrayerCard;
