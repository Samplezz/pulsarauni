'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const dict = {
  en: {
    // Nav
    nav_feed: 'Feed',
    nav_calendar: 'Calendar',
    nav_finals: 'Finals Schedule',
    nav_forums: 'Forums',
    nav_courses: 'My Courses',
    nav_messages: 'Messages',
    nav_post: 'Post Event',
    
    // Sidebar
    sb_report_bug: 'Report Bug 🐛',
    sb_admin: 'Admin',
    sb_logout: 'Logout',
    
    // Feed
    feed_title: 'The Feed',
    feed_subtitle: 'HNU Student Verified events.',
    feed_filter_all: 'All',
    
    // Forums
    forums_title: 'Forums',
    forums_subtitle: 'HNU · CS Faculty',
    forums_btn_new: '+ NEW THREAD',
    forums_btn_cancel: '✕ CANCEL',
    forums_new_title: 'NEW THREAD',
    forums_new_label_title: 'Title',
    forums_new_label_tag: 'Tag',
    forums_new_label_body: 'Body (optional)',
    forums_new_placeholder_title: "What's your question or topic?",
    forums_new_placeholder_body: 'Add more context if needed…',
    forums_btn_create: 'CREATE THREAD →',
    forums_reply_as: 'REPLY AS',
    forums_reply_placeholder: 'Write your reply…',
    forums_btn_reply: 'POST REPLY',
    forums_no_replies: 'No replies yet. Be the first.',
    forums_back: '← Forums',
    forums_threads: 'threads',
    
    // Messages
    msg_title: 'Messages',
    msg_subtitle: 'Direct messages',
    msg_btn_new: '+ NEW MESSAGE',
    msg_btn_cancel: '✕ CANCEL',
    msg_banner_title: 'WELL PROTECTED',
    msg_banner_desc: 'All of your messages are private and encrypted. No one else can see them.',
    msg_new_label: 'Who do you want to message?',
    msg_new_placeholder: 'username (e.g., ahmed99)',
    msg_btn_start: 'START CHAT →',
    msg_no_convos: 'No conversations yet. Start one!',
    msg_input_placeholder: 'Message...',
    msg_btn_send: 'SEND',
    msg_back: '← Inbox',
    
    // Calendar
    cal_title: 'Calendar',
    cal_subtitle: 'Monthly view of deadlines.',
    
    // Finals
    fin_title: 'Finals Schedule',
    fin_subtitle: 'Official University Exam Schedule',
    
    // Courses
    crs_title: 'My Courses',
    crs_subtitle: 'Your active semester courses.',
    
    // Post Event
    pe_title: 'Post Event',
    pe_subtitle: 'Add a new exam, assignment, or quiz.',
    pe_label_type: 'Event Type',
    pe_label_course: 'Course',
    pe_label_prof: 'Professor (optional)',
    pe_label_title: 'Title',
    pe_label_date: 'Date',
    pe_label_time: 'Time',
    pe_label_notes: 'Notes / Topics (optional)',
    pe_placeholder_title: 'e.g. Midterm Chapter 1-4',
    pe_placeholder_notes: 'What to study...',
    pe_btn_submit: 'POST FOR VERIFICATION →',
    
    // UserPopover
    up_tag: 'Tag User',
    up_msg: 'Message',
    
    // ReportModal
    rm_title: 'REPORT A BUG',
    rm_cat: 'Category',
    rm_desc: 'Description',
    rm_desc_placeholder: 'Describe the issue clearly…',
    rm_screenshot: 'Screenshot (optional)',
    rm_attach: '+ Attach screenshot',
    rm_btn_submit: 'SUBMIT REPORT →',
    rm_success: 'Report submitted. Thank you!',
    
    // Landing/Auth
    auth_title: 'Pulsara',
    auth_tagline: 'The student-verified deadline board. Anonymous, trusted, always on.',
    auth_waitlist_title: 'Join the Beta Waitlist',
    auth_waitlist_placeholder: 'university email address',
    auth_btn_waitlist: 'JOIN WAITLIST →',
    auth_login_title: 'Have an account?',
    auth_btn_login: 'LOG IN',
    landing_badge: 'FOR UNIVERSITY STUDENTS',
    landing_h1_1: 'Stop missing',
    landing_h1_2: 'deadlines.',
    landing_desc: 'Exams get announced in a 500-person WhatsApp group, then buried under memes and voice notes. Pulsara is a student-verified deadline board — anonymous, trusted, always on.',
    landing_success_title: 'You\'re on the list!',
    landing_success_desc: 'We\'ll notify you when Pulsara opens for your faculty.',
    landing_have_code: 'HAVE A CODE?',
    landing_notify_me: 'NOTIFY ME',
    landing_notify_update: 'You will be notified when there\'s any updates.',
    landing_code_cta: 'Have a classroom code?',
    landing_wa_annotation: 'exam info buried under 200+ messages',
    landing_wa_tap: '⚠ important info — tap to reveal',
    landing_wa_alert: '📌 EXAM ALERT',
    landing_wa_group: 'CS Faculty 2026 🎓',
    landing_wa_members: '342 members',
    landing_wa_msg_input: 'Message…',
    code_modal_h: 'Enter classroom code',
    code_modal_p: 'Ask your faculty representative for the access code to unlock Pulsara.',
    code_modal_label: 'Classroom code',
    code_modal_invalid: 'Invalid classroom code.',
    code_btn: 'UNLOCK ACCESS →',
    landing_how_title: 'HOW IT WORKS',
    landing_step1_title: 'Post',
    landing_step1_desc: 'Drop an exam, quiz, or assignment anonymously in 10 seconds. Events go to admin review before appearing.',
    landing_step2_title: 'Verify',
    landing_step2_desc: 'Peers upvote to confirm. 10 upvotes = student-verified. Wrong info gets flagged and reviewed.',
    landing_step3_title: 'Track',
    landing_step3_desc: "Clean calendar with color sticker labels per event type. Know what's coming without scrolling 200 messages.",
    landing_cta_h1: 'Your group chat',
    landing_cta_h2: 'shouldn\'t be a',
    landing_cta_h3: '.liability',
    landing_cta_p: 'Enter your classroom code to join students already tracking deadlines the right way.',
    landing_cta_btn: 'ENTER CLASSROOM CODE →',
    
    // Footer
    footer_product: 'PRODUCT',
    footer_feed: 'Feed',
    footer_calendar: 'Calendar',
    footer_reminders: 'Reminders',
    footer_company: 'COMPANY',
    footer_about: 'About',
    footer_careers: 'Careers',
    footer_contact: 'Contact',
    footer_legal: 'LEGAL',
    footer_privacy: 'Privacy',
    footer_terms: 'Terms',
    footer_copy: '© 2026 Pulsara. Made by students, for students.',
    
    // General
    gen_verified: 'Verified',
    gen_more: 'more',
    gen_your_post: 'YOUR POST',
    gen_optional: '(optional)'
  },
  ar: {
    // Nav
    nav_feed: 'الخلاصة',
    nav_calendar: 'التقويم',
    nav_finals: 'جدول النهائيات',
    nav_forums: 'المنتديات',
    nav_courses: 'مقرراتي',
    nav_messages: 'الرسائل',
    nav_post: 'إضافة حدث',
    
    // Sidebar
    sb_report_bug: 'الإبلاغ عن مشكلة 🐛',
    sb_admin: 'لوحة التحكم',
    sb_logout: 'تسجيل الخروج',
    
    // Feed
    feed_title: 'الخلاصة',
    feed_subtitle: 'الأحداث الموثقة للطلاب.',
    feed_filter_all: 'الكل',
    
    // Forums
    forums_title: 'المنتديات',
    forums_subtitle: 'الجامعة · كلية علوم الحاسب',
    forums_btn_new: '+ موضوع جديد',
    forums_btn_cancel: '✕ إلغاء',
    forums_new_title: 'موضوع جديد',
    forums_new_label_title: 'العنوان',
    forums_new_label_tag: 'التصنيف',
    forums_new_label_body: 'التفاصيل (اختياري)',
    forums_new_placeholder_title: "ما هو سؤالك أو موضوعك؟",
    forums_new_placeholder_body: 'أضف المزيد من السياق إذا لزم الأمر...',
    forums_btn_create: 'إنشاء موضوع ←',
    forums_reply_as: 'الرد باسم',
    forums_reply_placeholder: 'اكتب ردك...',
    forums_btn_reply: 'إرسال الرد',
    forums_no_replies: 'لا توجد ردود بعد. كن الأول.',
    forums_back: '← المنتديات',
    forums_threads: 'مواضيع',
    
    // Messages
    msg_title: 'الرسائل',
    msg_subtitle: 'الرسائل المباشرة',
    msg_btn_new: '+ رسالة جديدة',
    msg_btn_cancel: '✕ إلغاء',
    msg_banner_title: 'حماية تامة',
    msg_banner_desc: 'جميع رسائلك خاصة ومشفرة. لا أحد يستطيع رؤيتها سواك.',
    msg_new_label: 'لمن تريد إرسال رسالة؟',
    msg_new_placeholder: 'اسم المستخدم (مثل ahmed99)',
    msg_btn_start: 'بدء المحادثة ←',
    msg_no_convos: 'لا توجد محادثات. ابدأ الآن!',
    msg_input_placeholder: 'رسالة...',
    msg_btn_send: 'إرسال',
    msg_back: '← صندوق الوارد',
    
    // Calendar
    cal_title: 'التقويم',
    cal_subtitle: 'عرض شهري للمواعيد.',
    
    // Finals
    fin_title: 'جدول النهائيات',
    fin_subtitle: 'الجدول الرسمي للاختبارات النهائية',
    
    // Courses
    crs_title: 'مقرراتي',
    crs_subtitle: 'مقرراتك الدراسية النشطة.',
    
    // Post Event
    pe_title: 'إضافة حدث',
    pe_subtitle: 'أضف اختبار، واجب، أو كويز.',
    pe_label_type: 'نوع الحدث',
    pe_label_course: 'المقرر',
    pe_label_prof: 'الدكتور (اختياري)',
    pe_label_title: 'العنوان',
    pe_label_date: 'التاريخ',
    pe_label_time: 'الوقت',
    pe_label_notes: 'ملاحظات / مواضيع (اختياري)',
    pe_placeholder_title: 'مثال: ميدتيرم الفصول 1-4',
    pe_placeholder_notes: 'ما يجب دراسته...',
    pe_btn_submit: 'نشر للتحقق ←',
    
    // UserPopover
    up_tag: 'الإشارة للمستخدم',
    up_msg: 'إرسال رسالة',
    
    // ReportModal
    rm_title: 'الإبلاغ عن مشكلة',
    rm_cat: 'الفئة',
    rm_desc: 'الوصف',
    rm_desc_placeholder: 'صف المشكلة بوضوح...',
    rm_screenshot: 'لقطة شاشة (اختياري)',
    rm_attach: '+ إرفاق صورة',
    rm_btn_submit: 'إرسال البلاغ ←',
    rm_success: 'تم إرسال البلاغ. شكراً لك!',
    
    // Landing/Auth
    auth_title: 'Pulsara',
    auth_tagline: 'لوحة مواعيد موثقة من الطلاب. سرية، موثوقة، ودائماً متوفرة.',
    auth_waitlist_title: 'انضم إلى قائمة الانتظار',
    auth_waitlist_placeholder: 'البريد الإلكتروني الجامعي',
    auth_btn_waitlist: 'انضمام للقائمة ←',
    auth_login_title: 'لديك حساب؟',
    auth_btn_login: 'تسجيل الدخول',
    landing_badge: 'لطلاب الجامعة',
    landing_h1_1: 'لا تفوت المزيد من',
    landing_h1_2: 'المواعيد.',
    landing_desc: 'يتم الإعلان عن الاختبارات في مجموعة واتساب تضم 500 طالب، ثم تضيع بين الرسائل الصوتية. بولسارا هي لوحة مواعيد موثقة للطلاب - مجهولة الهوية، موثوقة، ودائماً متوفرة.',
    landing_success_title: 'أنت في القائمة!',
    landing_success_desc: 'سنقوم بإبلاغك عندما يتم إطلاق بولسارا لكليتك.',
    landing_have_code: 'لديك رمز؟',
    landing_notify_me: 'أخبرني',
    landing_notify_update: 'سيتم إخطارك عند وجود أي تحديثات.',
    landing_code_cta: 'لديك رمز الفصل؟',
    landing_wa_annotation: 'معلومات الاختبار مدفونة تحت 200+ رسالة',
    landing_wa_tap: '⚠ معلومة مهمة — اضغط للكشف',
    landing_wa_alert: '📌 تنبيه اختبار',
    landing_wa_group: 'كلية علوم الحاسب 2026 🎓',
    landing_wa_members: '342 عضوًا',
    landing_wa_msg_input: 'رسالة…',
    code_modal_h: 'أدخل رمز الفصل',
    code_modal_p: 'اطلب من ممثل كليتك رمز الوصول لفتح بولسارا.',
    code_modal_label: 'رمز الفصل',
    code_modal_invalid: 'رمز الفصل غير صحيح.',
    code_btn: '← فتح الوصول',
    landing_how_title: 'كيف يعمل',
    landing_step1_title: 'انشر',
    landing_step1_desc: 'أضف اختبار أو كويز أو واجب بشكل مجهول في 10 ثوانٍ. تمر الأحداث عبر مراجعة المسؤول قبل الظهور.',
    landing_step2_title: 'تحقق',
    landing_step2_desc: 'يصوت الزملاء للتأكيد. 10 تصويتات = موثق من الطلاب. المعلومات الخاطئة تُبلَّغ عنها وتُراجع.',
    landing_step3_title: 'تتبع',
    landing_step3_desc: 'تقويم نظيف مع ملصقات ملونة لكل نوع حدث. اعرف ما هو قادم دون التمرير عبر 200 رسالة.',
    landing_cta_h1: 'دردشة مجموعتك',
    landing_cta_h2: 'لا يجب أن تكون',
    landing_cta_h3: '.عبئاً',
    landing_cta_p: 'أدخل رمز الفصل للانضمام إلى الطلاب الذين يتتبعون المواعيد بالطريقة الصحيحة.',
    landing_cta_btn: '← أدخل رمز الفصل',
    
    // Footer
    footer_product: 'المنتج',
    footer_feed: 'الخلاصة',
    footer_calendar: 'التقويم',
    footer_reminders: 'التذكيرات',
    footer_company: 'الشركة',
    footer_about: 'عن بولسارا',
    footer_careers: 'وظائف',
    footer_contact: 'تواصل معنا',
    footer_legal: 'القانونية',
    footer_privacy: 'الخصوصية',
    footer_terms: 'الشروط',
    footer_copy: '© 2026 بولسارا. من الطلاب، للطلاب.',
    
    // General
    gen_verified: 'موثق',
    gen_more: 'متبقي',
    gen_your_post: 'منشورك',
    gen_optional: '(اختياري)'
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('pulsara_lang') || 'en';
    setLang(saved);
    document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = saved;
  }, []);

  function toggleLanguage() {
    const next = lang === 'en' ? 'ar' : 'en';
    setLang(next);
    localStorage.setItem('pulsara_lang', next);
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = next;
  }

  function t(key) {
    return dict[lang]?.[key] || dict.en[key] || key;
  }

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      <div dir={lang === 'ar' ? 'rtl' : 'ltr'} style={{ height: '100%' }}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
