
;(function(){/* v249: تعليم العبادات — الوضوء، الصلاة، التيمم، الغسل */
var AR=__ar;
var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})};
var IC={drop:'<path d="M12 3c-3 4.5-6 7.8-6 11a6 6 0 0 0 12 0c0-3.2-3-6.5-6-11z"/>',hand:'<path d="M7 11V5a1.5 1.5 0 0 1 3 0v5M10 10V3.5a1.5 1.5 0 0 1 3 0V10M13 10V4.5a1.5 1.5 0 0 1 3 0V12M16 9a1.5 1.5 0 0 1 3 0v5c0 4-3 7-7 7s-6-2-7-5l-2-4a1.5 1.5 0 0 1 2.5-1.5L7 13"/>',heart:'<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',stand:'<path d="M12 4v16M8 20h8"/><circle cx="12" cy="4" r="1.5"/>',bow:'<path d="M4 9h12M16 9v11M4 9v2"/>',down:'<path d="M3 19h18M6 19l4-6h6"/>',sit:'<path d="M5 19h14M8 19v-6h6l3 6"/>',book:'<path d="M4 5h7v14H4zM13 5h7v14h-7z"/>',salam:'<path d="M4 12a8 8 0 1 0 16 0 8 8 0 0 0-16 0M12 4v16"/>',earth:'<path d="M3 17h18M6 17c1-4 3-6 6-6s5 2 6 6"/>',check:'<path d="M5 12l5 5 9-10"/>'};
var ic=function(k){return'<svg viewBox="0 0 24 24" class="lr-ic" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+(IC[k]||IC.check)+'</svg>'};
var L=[
{id:"wudu",title:"الوضوء",sub:"كما توضّأ النبي ﷺ",intro:"عن حُمرانَ مولى عثمان أنّ عثمانَ رضي الله عنه دعا بوَضوء فتوضّأ، ثم قال: رأيتُ رسولَ الله ﷺ توضّأ نحوَ وضوئي هذا. (متفق عليه: البخاري ١٥٩، ومسلم ٢٢٦)",steps:[
{k:"heart",t:"النيّة",d:"تنوي بقلبك أنك تتوضأ لرفع الحدث. محلّ النية القلب، ولا يُشرع التلفّظ بها.",tag:"لازم",src:"«إنما الأعمال بالنيات» متفق عليه"},
{k:"drop",t:"التسمية",d:"تقول قبل البدء:",say:"بِسْمِ اللهِ",tag:"سنة",src:"أبو داود ١٠١، وابن ماجه ٣٩٧"},
{k:"hand",t:"غسل الكفّين",d:"تغسل كفّيك ثلاث مرات.",tag:"سنة",src:"البخاري ١٥٩، ومسلم ٢٢٦"},
{k:"drop",t:"المضمضة والاستنشاق",d:"تأخذ الماء بيدك اليمنى فتُدخله في فمك وتحرّكه ثم تمجّه، وتستنشق الماء بأنفك ثم تستنثره باليسرى. ثلاث مرات.",tag:"مأمور به",src:"البخاري ١٥٩، ومسلم ٢٢٦"},
{k:"drop",t:"غسل الوجه",d:"تغسل وجهك ثلاث مرات، من منابت شعر الرأس إلى أسفل اللحية طولًا، ومن الأذن إلى الأذن عرضًا.",tag:"ركن",src:"﴿فَاغْسِلُوا وُجُوهَكُمْ﴾ المائدة ٦"},
{k:"hand",t:"غسل اليدين إلى المرفقين",d:"تغسل يدك اليمنى من أطراف الأصابع حتى المرفق ثلاثًا، ثم اليسرى ثلاثًا.",tag:"ركن",src:"﴿وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ﴾ المائدة ٦"},
{k:"hand",t:"مسح الرأس والأذنين",d:"تمسح رأسك بيديك المبلولتين مرة واحدة: تبدأ من مقدّمه إلى قفاه ثم تردّهما إلى المكان الذي بدأت منه، ثم تمسح أذنيك.",tag:"ركن",src:"﴿وَامْسَحُوا بِرُءُوسِكُمْ﴾؛ البخاري ١٨٥، ومسلم ٢٣٥"},
{k:"drop",t:"غسل الرجلين إلى الكعبين",d:"تغسل رجلك اليمنى إلى الكعبين ثلاثًا، ثم اليسرى ثلاثًا، وتخلّل بين الأصابع.",tag:"ركن",src:"﴿وَأَرْجُلَكُمْ إِلَى الْكَعْبَيْنِ﴾ المائدة ٦"},
{k:"check",t:"الدعاء بعد الوضوء",d:"تقول بعد الفراغ:",say:"أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",tag:"سنة",src:"مسلم ٢٣٤"}],
notes:["الترتيب والموالاة (عدم التأخير الطويل بين الأعضاء) من صفة وضوء النبي ﷺ.","يجوز الوضوء مرة مرة، ومرتين مرتين، والأكمل ثلاثًا (البخاري ١٥٧–١٥٩).","نواقض الوضوء: الخارج من السبيلين، والنوم المستغرق، وزوال العقل، وأكل لحم الإبل (مسلم ٣٦٠)."]},
{id:"salah",title:"صفة الصلاة",sub:"«صلّوا كما رأيتموني أصلّي»",intro:"قال النبي ﷺ: «صَلُّوا كَمَا رَأَيْتُمُونِي أُصَلِّي». (البخاري ٦٣١). هذه صفة ركعتين، كصلاة الفجر.",steps:[
{k:"stand",t:"استقبال القبلة والنية",d:"تقف متوضّئًا مستقبل القبلة، وتنوي بقلبك الصلاة التي تريدها.",tag:"شرط",src:"﴿فَوَلِّ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ﴾ البقرة ١٤٤"},
{k:"hand",t:"تكبيرة الإحرام",d:"ترفع يديك حذو منكبيك أو أذنيك وتقول:",say:"اللهُ أَكْبَرُ",tag:"ركن",src:"البخاري ٧٣٥، ومسلم ٣٩٠"},
{k:"stand",t:"دعاء الاستفتاح",d:"تضع يدك اليمنى على اليسرى على صدرك، وتقول سرًّا:",say:"سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ",tag:"سنة",src:"أبو داود ٧٧٥، والترمذي ٢٤٣"},
{k:"book",t:"قراءة الفاتحة",d:"تستعيذ وتبسمل سرًّا، ثم تقرأ سورة الفاتحة، ثم تقرأ ما تيسّر من القرآن في الركعتين الأوليين.",tag:"ركن",src:"«لا صلاة لمن لم يقرأ بفاتحة الكتاب» متفق عليه"},
{k:"bow",t:"الركوع",d:"تكبّر وتركع، فتضع يديك على ركبتيك ويستوي ظهرك، وتقول ثلاثًا:",say:"سُبْحَانَ رَبِّيَ الْعَظِيمِ",tag:"ركن",src:"مسلم ٧٧٢"},
{k:"stand",t:"الرفع من الركوع",d:"ترفع وأنت تقول: «سَمِعَ اللهُ لِمَنْ حَمِدَهُ»، فإذا استويت قائمًا قلت:",say:"رَبَّنَا وَلَكَ الْحَمْدُ",tag:"ركن",src:"البخاري ٧٨٩، ومسلم ٣٩٢"},
{k:"down",t:"السجود",d:"تكبّر وتسجد على سبعة أعضاء: الجبهة مع الأنف، والكفّين، والركبتين، وأطراف القدمين، وتقول ثلاثًا:",say:"سُبْحَانَ رَبِّيَ الْأَعْلَى",tag:"ركن",src:"البخاري ٨١٢، ومسلم ٤٩٠ و٧٧٢"},
{k:"sit",t:"الجلسة بين السجدتين",d:"تكبّر وترفع رأسك وتجلس مطمئنًّا، وتقول:",say:"رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي",tag:"ركن",src:"أبو داود ٨٧٤، وابن ماجه ٨٩٧"},
{k:"down",t:"السجدة الثانية",d:"تكبّر وتسجد مرة أخرى مثل الأولى، ثم تكبّر وتقوم للركعة الثانية فتصلّيها مثل الأولى (بلا استفتاح).",tag:"ركن",src:"البخاري ٧٥٧ (حديث المسيء صلاته)"},
{k:"sit",t:"التشهّد",d:"بعد الركعة الثانية تجلس وتقول:",say:"التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",tag:"ركن",src:"البخاري ٨٣١، ومسلم ٤٠٢"},
{k:"sit",t:"الصلاة على النبي ﷺ",d:"ثم تقول:",say:"اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ",tag:"ركن",src:"البخاري ٣٣٧٠"},
{k:"salam",t:"التسليم",d:"تلتفت إلى اليمين ثم إلى اليسار وتقول في كل مرة:",say:"السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ",tag:"ركن",src:"أبو داود ٩٩٦، والترمذي ٢٩٥"}],
notes:["عدد الركعات: الفجر ٢، الظهر ٤، العصر ٤، المغرب ٣، العشاء ٤.","في الصلاة الرباعية والثلاثية: بعد التشهد الأول تقوم للركعة الثالثة، وتقرأ الفاتحة فقط في الركعتين الأخيرتين، ثم تتشهّد التشهّد الأخير وتسلّم.","الطمأنينة في كل ركن واجبة: «ارجع فصلِّ فإنك لم تصلِّ» (البخاري ٧٥٧)."]},
{id:"tayammum",title:"التيمم",sub:"عند فقد الماء أو العجز عن استعماله",intro:"قال تعالى: ﴿فَلَمْ تَجِدُوا مَاءً فَتَيَمَّمُوا صَعِيدًا طَيِّبًا فَامْسَحُوا بِوُجُوهِكُمْ وَأَيْدِيكُمْ مِنْهُ﴾ (المائدة ٦).",steps:[
{k:"heart",t:"النية",d:"تنوي بقلبك التيمم بدل الوضوء أو الغسل.",tag:"لازم",src:"«إنما الأعمال بالنيات» متفق عليه"},
{k:"earth",t:"الضرب على الأرض",d:"تسمّي، ثم تضرب بكفّيك الأرض الطاهرة (التراب) ضربة واحدة.",tag:"ركن",src:"البخاري ٣٤٧، ومسلم ٣٦٨"},
{k:"hand",t:"مسح الوجه والكفّين",d:"تنفخ فيهما أو تنفضهما، ثم تمسح بهما وجهك، ثم تمسح كفّيك ظاهرهما وباطنهما.",tag:"ركن",src:"حديث عمار: البخاري ٣٤٧، ومسلم ٣٦٨"}],
notes:["يبطل التيمم بما يبطل الوضوء، وبوجود الماء لمن تيمّم لفقده."]},
{id:"ghusl",title:"الغسل",sub:"صفة غسل النبي ﷺ",intro:"عن عائشة رضي الله عنها في صفة غسل النبي ﷺ من الجنابة. (البخاري ٢٤٨، ومسلم ٣١٦)",steps:[
{k:"heart",t:"النية والتسمية",d:"تنوي بقلبك رفع الحدث الأكبر، وتقول: بسم الله.",tag:"لازم",src:"«إنما الأعمال بالنيات» متفق عليه"},
{k:"hand",t:"غسل الكفّين والفرج",d:"تغسل كفّيك، ثم تغسل فرجك وما أصابه الأذى.",tag:"سنة",src:"البخاري ٢٤٩، ومسلم ٣١٧"},
{k:"drop",t:"الوضوء",d:"تتوضأ وضوءك للصلاة.",tag:"سنة",src:"البخاري ٢٤٨"},
{k:"drop",t:"إفاضة الماء على الرأس",d:"تخلّل شعرك بالماء حتى تُروي أصوله، ثم تصبّ على رأسك ثلاث مرات.",tag:"سنة",src:"البخاري ٢٤٨"},
{k:"drop",t:"تعميم الجسد",d:"تفيض الماء على سائر جسدك، تبدأ بالشقّ الأيمن ثم الأيسر، حتى يعمّ الماء جميع البدن.",tag:"ركن",src:"البخاري ٢٤٨، ومسلم ٣١٦"}],
notes:["الركن في الغسل: النية وتعميم البدن بالماء، وما سوى ذلك من الكمال والسنة."]},
{id:"sahw",title:"سجود السهو",sub:"إذا زدت أو نقصت أو شككت في صلاتك",intro:"سجود السهو سجدتان كسجود الصلاة، يجبر بهما المصلي ما وقع في صلاته من زيادة أو نقص أو شك.",steps:[
{k:"sit",t:"إذا نقصت واجبًا",d:"مثل أن تنسى التشهد الأول وتقوم للركعة الثالثة: تُكمل صلاتك، فإذا انتهيت من التشهد الأخير سجدت سجدتين قبل أن تسلّم، ثم تسلّم.",tag:"سنة",src:"حديث عبد الله بن بُحينة: البخاري ٨٢٩، ومسلم ٥٧٠"},
{k:"salam",t:"إذا سلّمت قبل التمام أو زدت",d:"إذا سلّمت قبل تمام صلاتك ثم تذكّرت قريبًا، تقوم فتأتي بما بقي، ثم تسلّم، ثم تسجد سجدتين، ثم تسلّم.",tag:"سنة",src:"حديث ذي اليدين: البخاري ١٢٢٩، ومسلم ٥٧٣"},
{k:"heart",t:"إذا شككت",d:"إذا شككت كم صلّيت: ثلاثًا أم أربعًا، فاطرح الشكّ وابنِ على الأقل لأنه المتيقَّن، ثم اسجد سجدتين قبل أن تسلّم.",tag:"سنة",src:"«فليطرح الشك وليبنِ على ما استيقن» مسلم ٥٧١"},
{k:"down",t:"صفة السجدتين",d:"تكبّر وتسجد، وتقول ما تقوله في سجود الصلاة، ثم تكبّر وتجلس، ثم تسجد الثانية كذلك.",tag:"سنة",src:"البخاري ١٢٢٩"}],
notes:["من سها عن واجب أو زاد سهوًا جبره بسجود السهو، أما الأركان كالركوع والسجود فلا بد من الإتيان بها.","المأموم يتابع إمامه في سجود السهو."]},
{id:"janaza",title:"صلاة الجنازة",sub:"أربع تكبيرات بلا ركوع ولا سجود",intro:"عن أبي هريرة رضي الله عنه أن رسول الله ﷺ نعى النجاشي في اليوم الذي مات فيه، فصفّ بهم وكبّر عليه أربع تكبيرات. (البخاري ١٣٣٣)",steps:[
{k:"stand",t:"النية والتكبيرة الأولى",d:"تقف مستقبل القبلة والجنازة أمامك، وتنوي بقلبك، وتكبّر، ثم تستعيذ وتقرأ الفاتحة سرًّا.",say:"اللهُ أَكْبَرُ",tag:"ركن",src:"البخاري ١٣٣٥؛ النسائي ١٩٨٩"},
{k:"stand",t:"التكبيرة الثانية",d:"تكبّر، ثم تصلّي على النبي ﷺ بالصلاة الإبراهيمية كما في التشهد.",say:"اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ...",tag:"ركن",src:"حديث أبي أمامة بن سهل عن رجل من الصحابة: رواه الشافعي في «الأم» والبيهقي (٤/٣٩)، وصحح إسناده الألباني في «إرواء الغليل»"},
{k:"heart",t:"التكبيرة الثالثة",d:"تكبّر، ثم تدعو للميت بإخلاص، ومن الوارد:",say:"اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ، وَعَافِهِ وَاعْفُ عَنْهُ، وَأَكْرِمْ نُزُلَهُ، وَوَسِّعْ مُدْخَلَهُ، وَاغْسِلْهُ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ",tag:"ركن",src:"مسلم ٩٦٣"},
{k:"salam",t:"التكبيرة الرابعة والتسليم",d:"تكبّر، وتقف قليلًا، ثم تسلّم عن يمينك.",say:"السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ",tag:"ركن",src:"النسائي ١٩٨٩"}],
notes:["تقول للأنثى: «اللهم اغفر لها وارحمها...» بضمير المؤنث.","صلاة الجنازة فرض كفاية، وفيها أجر عظيم: «من شهد الجنازة حتى يُصلَّى عليها فله قيراط» (متفق عليه)."]},
{id:"safar",title:"صلاة المسافر",sub:"القصر والجمع",intro:"قال النبي ﷺ عن القصر: «صَدَقَةٌ تَصَدَّقَ اللهُ بِهَا عَلَيْكُمْ، فَاقْبَلُوا صَدَقَتَهُ». (مسلم ٦٨٦)",steps:[
{k:"stand",t:"القصر",d:"تصلّي الصلاة الرباعية (الظهر والعصر والعشاء) ركعتين. أما الفجر والمغرب فلا تُقصران.",tag:"سنة",src:"مسلم ٦٨٦"},
{k:"check",t:"الجمع",d:"يجوز للمسافر أن يجمع بين الظهر والعصر، وبين المغرب والعشاء، في وقت إحداهما.",tag:"رخصة",src:"البخاري ١١٠٧، ومسلم ٧٠٥"},
{k:"salam",t:"متى يبدأ ومتى ينتهي",d:"تبدأ رخصة القصر إذا خرجت من بلدك مسافرًا، وتنتهي إذا رجعت إليه. وإذا صلّيت خلف إمام مقيم أتممت معه.",tag:"تنبيه",src:"فعل النبي ﷺ والصحابة"}],
notes:["مسافة القصر عند جمهور العلماء نحو ٨٠ كيلومترًا، وفي المسألة خلاف بين أهل العلم."]},
{id:"marid",title:"صلاة المريض",sub:"«فاتقوا الله ما استطعتم»",intro:"قال النبي ﷺ لعمران بن حصين: «صَلِّ قَائِمًا، فَإِنْ لَمْ تَسْتَطِعْ فَقَاعِدًا، فَإِنْ لَمْ تَسْتَطِعْ فَعَلَى جَنْبٍ». (البخاري ١١١٧)",steps:[
{k:"stand",t:"قائمًا إن استطعت",d:"إذا استطعت القيام صلّيت قائمًا، ولو مستندًا إلى جدار أو عصا.",tag:"ركن",src:"البخاري ١١١٧"},
{k:"sit",t:"قاعدًا",d:"إذا شقّ عليك القيام صلّيت جالسًا، وتركع وتسجد إن استطعت، وإلا أومأت برأسك وجعلت السجود أخفض من الركوع.",tag:"رخصة",src:"البخاري ١١١٧"},
{k:"down",t:"على جنبك",d:"إذا لم تستطع الجلوس صلّيت على جنبك الأيمن ووجهك إلى القبلة، وتومئ برأسك.",tag:"رخصة",src:"البخاري ١١١٧"},
{k:"heart",t:"لا تترك الصلاة",d:"لا تسقط الصلاة عن المريض ما دام عقله معه، فيصلّي على قدر استطاعته، ويجوز له الجمع إذا شقّ عليه أداء كل صلاة في وقتها.",tag:"تنبيه",src:"﴿فَاتَّقُوا اللَّهَ مَا اسْتَطَعْتُمْ﴾ التغابن ١٦"}],
notes:["إذا عجز المريض عن الوضوء تيمّم."]}
];
window.__learnData=L;
var root=null;
function close(silent){if(!root)return;root.remove();root=null;document.documentElement.classList.remove("wp-open");if(!silent&&history.state&&history.state.lr)history.back()}
addEventListener("popstate",function(){if(root&&!(history.state&&history.state.lr))close(true)});
function shell(t,s){if(root)close(true);root=document.createElement("div");root.className="wp-page tl-page lr-page";root.id="learnPage";root.innerHTML='<header class="wp-h"><button type="button" class="wp-back" aria-label="رجوع">→</button><div><h1>'+t+'</h1><p>'+s+'</p></div></header><div class="wp-body kd-body"></div>';document.body.appendChild(root);document.documentElement.classList.add("wp-open");root.querySelector(".wp-back").onclick=function(){close()};requestAnimationFrame(function(){root&&root.classList.add("in")});setTimeout(function(){root&&root.classList.add("in")},60);if(!history.state||!history.state.lr)try{history.pushState({lr:1},"","/learn")}catch(e){}return root.querySelector(".kd-body")}
function list(){var b=shell("تعليم العبادات","خطوة بخطوة من القرآن والسنة");b.innerHTML=L.map(function(x,i){return'<button type="button" class="lr-card" data-i="'+i+'"><span class="lr-num">'+ic(x.steps[0].k==="heart"?"drop":"stand")+'</span><span class="kd-ct"><b>'+x.title+'</b><small>'+x.sub+' · '+AR(x.steps.length)+' خطوات</small></span></button>'}).join("")+'<p class="kd-note">مأخوذ من نصوص القرآن والصحيحين والسنن، مع ذكر المصدر تحت كل خطوة.</p>';b.onclick=function(e){var c=e.target.closest(".lr-card");if(c)one(+c.dataset.i,-1)}}
function one(i,p){var x=L[i],N=x.steps.length,b=root.querySelector(".kd-body");root.querySelector(".wp-h h1").textContent=x.title;root.querySelector(".wp-h p").textContent=x.sub;
 function prog(){return'<div class="kd-prog">'+x.steps.map(function(_,k){return'<i class="'+(k<=p?"on":"")+'"></i>'}).join("")+'</div>'}
 function draw(){if(p<0){b.innerHTML='<section class="lr-intro">'+esc(x.intro)+'</section><ol class="lr-list">'+x.steps.map(function(s,k){return'<li><button type="button" data-go="'+k+'"><span class="lr-n">'+AR(k+1)+'</span><span>'+esc(s.t)+'</span><em class="lr-tag t-'+s.tag+'">'+s.tag+'</em></button></li>'}).join("")+'</ol>'+(x.notes?'<section class="kd-learn"><h2>تنبيهات</h2><ul>'+x.notes.map(function(n){return'<li>'+esc(n)+'</li>'}).join("")+'</ul></section>':'')+'<div class="kd-nav"><button type="button" class="btn btn-primary" data-k="next">ابدأ خطوة بخطوة</button></div>'}
  else if(p<N){var s=x.steps[p];b.innerHTML=prog()+'<section class="lr-step"><div class="lr-big">'+ic(s.k)+'<span>'+AR(p+1)+'</span></div><h2>'+esc(s.t)+' <em class="lr-tag t-'+s.tag+'">'+s.tag+'</em></h2><p class="kd-text">'+esc(s.d)+'</p>'+(s.say?'<p class="lr-say">'+esc(s.say)+'</p>':'')+'<p class="kd-src">المصدر: '+esc(s.src)+'</p></section><div class="kd-nav"><button type="button" class="btn btn-ghost" data-k="prev">السابق</button><button type="button" class="btn btn-primary" data-k="next">'+(p<N-1?"التالي":"تمّ ✓")+'</button></div>'}
  else{b.innerHTML=prog()+'<section class="kd-learn"><h2>أحسنت! أتممت «'+esc(x.title)+'»</h2><ul>'+(x.notes||[]).map(function(n){return'<li>'+esc(n)+'</li>'}).join("")+'</ul></section><div class="kd-nav"><button type="button" class="btn btn-ghost" data-k="restart">من البداية</button><button type="button" class="btn btn-primary" data-k="list">كل الدروس</button></div>'}
  try{root.scrollTo(0,0)}catch(e){}}
 b.onclick=function(e){var g=e.target.closest("[data-go]");if(g){p=+g.dataset.go;draw();return}var k=e.target.closest("[data-k]");if(!k)return;var a=k.dataset.k;if(a==="next"){p++;draw()}else if(a==="prev"){p--;draw()}else if(a==="restart"){p=-1;draw()}else if(a==="list")list()};
 var sx=null;b.ontouchstart=function(e){sx=e.touches[0].clientX};b.ontouchend=function(e){if(sx==null)return;var dx=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)>60){if(dx>0&&p<N){p++;draw()}else if(dx<0&&p>-1){p--;draw()}}};
 draw()}
window.__openLearn=function(id){list();if(id){for(var i=0;i<L.length;i++)if(L[i].id===id)one(i,-1)}};
function drawer(){var p=document.querySelector(".dr2 .dr-p");if(!p||p.querySelector('[data-n="learn"]'))return;var ref=p.querySelector('[data-n="kids"]')||p.querySelector('[data-n="tools"]');if(!ref)return;var a=ref.cloneNode(true);a.dataset.n="learn";a.removeAttribute("id");a.removeAttribute("href");var l=a.querySelector(".dr-l");if(l)l.textContent="تعليم العبادات";var s=a.querySelector("svg");if(s)s.innerHTML=IC.drop;ref.after(a);a.addEventListener("click",function(e){e.preventDefault();e.stopImmediatePropagation();var x=p.querySelector(".dr-x");x&&x.click();setTimeout(list,150)},true)}
function tile(){if(document.getElementById("lrTile"))return;var ref=document.getElementById("kdHome");if(!ref)return;var c=ref.cloneNode(true);c.id="lrTile";var leaves=[].filter.call(c.querySelectorAll("*"),function(n){return n.children.length===0&&n.textContent.trim()});if(leaves[0])leaves[0].textContent="تعليم العبادات";if(leaves[1])leaves[1].textContent="الوضوء والصلاة";c.querySelector(".l2-si")&&delete c.querySelector(".l2-si").dataset.t;c.addEventListener("click",function(e){e.preventDefault();e.stopImmediatePropagation();list()},true);ref.parentElement.insertBefore(c,ref.nextSibling)}
function boot(){drawer();tile();if(location.pathname.replace(/\/$/,"")==="/learn")setTimeout(list,300)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
var T;new MutationObserver(function(){clearTimeout(T);T=setTimeout(function(){drawer();tile()},0)}).observe(document.body,{childList:true,subtree:true});
})();
