import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Purchases, { LOG_LEVEL } from "react-native-purchases";

// Keep justice-hub-logo.png in the Snack project root, beside App.js.
const logo = require("./justice-hub-logo.png");

// Keep this value in a local .env file. Never commit it to GitHub.
const REVENUECAT_TEST_KEY = process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY || "";

const C = {
  cream: "#FFF9E8", parchment: "#FFF6DC", pale: "#FFF1C7",
  honey: "#F4C95D", gold: "#B98525", brown: "#332D22",
  muted: "#766F62", white: "#FFFFFF", line: "#EADBB5", safety: "#9B4537",
};

function locationText(location) {
  return [location.country, location.province, location.city, location.district]
    .filter(Boolean)
    .join(" • ") || "No location selected";
}

function has(text, words) {
  return words.test(text.toLowerCase());
}

function chinaLaw(title, article, explanation, vocabulary, url) {
  return {
    verified: true,
    title: `${title} — ${article}`,
    explanation,
    vocabulary,
    url,
  };
}

function thailandLaw(title, article, explanation, vocabulary, url) {
  return {
    verified: true,
    country: "Thailand",
    title: `${title} — ${article}`,
    explanation,
    vocabulary,
    url,
  };
}

function supportContacts(location) {
  const thailand = location.country === "Thailand";
  return thailand
    ? [["191", "Police / urgent emergency", "For an urgent safety or police emergency."], ["1669", "Emergency medical service", "For urgent medical care or an ambulance."], ["1300", "Social Assistance Centre", "Nationwide social support, including child and family support."], ["1323", "Mental Health Hotline", "Nationwide mental-health support."], ["1579", "Child and Family Rights Protection Centre", "A Ministry of Education child and family protection contact."], ["1111", "Government Contact Center", "General government contact and service information."]]
    : [["110", "Police / emergency assistance", "For crimes, threats, danger, or urgent police help."], ["120", "Medical emergency", "For urgent medical care, serious injury, or an ambulance."], ["119", "Fire and rescue", "For fire or rescue emergencies."], ["122", "Traffic accident", "For a road-traffic accident needing traffic police."], ["12348", "Legal aid and legal information", "For public legal consultation and legal-aid guidance."], ["12345", "Government service hotline", "For local public-service questions and non-emergency help."], ["96110", "Anti-scam warning", "For anti-fraud warning and related guidance."]];
}

function sexualAssaultResponse(location) {
  const thailand = location.country === "Thailand";
  const law = thailand
    ? thailandLaw(
      "Thailand Penal Code",
      "Section 276",
      "Section 276 may be relevant to an allegation of rape as defined by Thai law. It covers conduct involving threats, force, inability to resist, or deception as set out in the law. Whether it applies to a particular report, and which offence is appropriate, must be determined by the competent authorities using the full facts.",
      ["Consent: freely given permission. Silence, fear, or pressure should not be treated as permission.", "Forensic medical examination: medical care that can also document injuries or collect evidence, if you choose and it is available.", "Evidence: information that may help explain what happened; your safety and health come first."],
      "https://ratchakitcha.soc.go.th/documents/225014.pdf"
    )
    : chinaLaw(
      "Criminal Law of the People’s Republic of China",
      "Article 236",
      "Article 236 may be relevant to an allegation of rape as defined by Chinese criminal law. It addresses rape through violence, coercion, or other means, and contains specific rules for sexual acts involving a girl under 14. Whether the article applies to a particular report must be determined by the competent authorities using the full facts.",
      ["Consent: freely given permission. Silence, fear, or pressure should not be treated as permission.", "Forensic medical examination: medical care that can also document injuries or collect evidence, if you choose and it is available.", "Evidence: information that may help explain what happened; your safety and health come first."],
      "https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/bgt/art/2025/art_890f1333b6284c3cbb225c3cd2647c4b.html"
    );

  return {
    heading: "Your safety and health may matter right now",
    comfort: "I’m so sorry this happened. It is not your fault. You deserve safety, medical care, and support. You can choose which steps feel safest for you.",
    emergency: true,
    understood: "You may be describing rape, attempted rape, forced sexual contact, or concern that you were drugged. Your safety and health are the priority.",
    relevant: "This may involve urgent medical care, personal safety, possible forensic evidence, and criminal law. Police, prosecutors, and courts—not Justice Hub—decide what legal offence, if any, applies to a report.",
    law,
    steps: thailand
      ? ["If you may be in danger, get to a safer public place or trusted adult and call 191. For urgent medical help, call 1669.", "Go to a hospital or clinic as soon as you can. They can check injuries and discuss urgent health care. You can ask what choices are available even if you are not sure about reporting.", "Tell a trusted adult, counsellor, family member, or other safe support person. Do not meet or confront the person alone.", "If it is safe, write down what you remember, save messages or links, and note dates and locations. Do not take risks to collect information."]
      : ["If you may be in danger, get to a safer public place or trusted adult and call 110. For urgent medical help, call 120.", "Go to a hospital or clinic as soon as you can. They can check injuries and discuss urgent health care. You can ask what choices are available even if you are not sure about reporting.", "Tell a trusted adult, counsellor, family member, or other safe support person. Do not meet or confront the person alone.", "If it is safe, write down what you remember, save messages or links, and note dates and locations. Do not take risks to collect information."],
    evidenceSafety: "Only if it is safe and you may want a medical-forensic examination or report: try not to shower, bathe, clean yourself or the scene, or change clothes before you get medical advice. Do not delay safety or urgent medical care for evidence. Even if you have already showered or changed clothes, you can still get medical care and ask for help.",
  };
}

function createResponse(question, location) {
  const q = question.trim();
  const china = location.country.trim().toLowerCase() === "china" || location.country.includes("中国");
  const thailand = location.country.trim().toLowerCase() === "thailand" || location.country.includes("泰国");
  const sexualAssault = has(q, /rape|raped|attempted rape|sexual assault|sexual violence|forced sex|forced to have sex|drugged|date rape|强奸|被强奸|强奸未遂|性侵|性侵犯|性暴力|迷奸|下药|ข่มขืน|ถูกข่มขืน|พยายามข่มขืน|ความรุนแรงทางเพศ|ถูกวางยา/);
  const domestic = has(q, /husband|wife|partner|spouse|boyfriend|girlfriend|ex-partner|ex partner|family member|mother|father|grandma|grandmother|grandpa|grandfather|domestic violence|domestic abuse|abusing|abusive|家暴|家庭暴力|虐待|แฟน|สามี|ภรรยา|คู่รัก|ความรุนแรงในครอบครัว/);
  const danger = has(q, /abuse|abused|abusing|hurt|harm|violent|violence|threat|attack|虐待|伤害|暴力|威胁/);
  const harassment = has(q, /sexual harassment|sexually harass|sexual message|sexual comment|touched me|unwanted touching|性骚扰|性暗示|猥亵|摸我|ล่วงละเมิดทางเพศ|คุกคามทางเพศ/);
  const womenWork = has(q, /pregnant|pregnancy|maternity|breastfeed|gender discrimination|discriminat|怀孕|产假|哺乳|性别歧视|เลือกปฏิบัติ|ตั้งครรภ์|ลาคลอด/);
  const elderly = has(q, /elderly|senior|older person|over 60|grandma|grandmother|grandpa|grandfather|support my parent|neglect.*elder|老年人|老人|奶奶|爷爷|外公|外婆|赡养|照顾老人|遗弃老人/);
  const work = has(q, /work|workplace|job|boss|employer|salary|wage|pay|fired|dismiss|overtime|劳动合同|工作|公司|老板|工资|薪水|劳动|辞退|加班/);
  const privacy = has(q, /photo|picture|image|portrait|video|privacy|personal information|phone number|address|rumou?r|defam|slander|reputation|照片|图片|肖像|视频|隐私|个人信息|手机号|住址|谣言|诽谤|名誉|รูปภาพ|รูปถ่าย|วิดีโอ|ข้อมูลส่วนบุคคล|เบอร์โทร|ที่อยู่|โพสต์|เผยแพร่/);
  const bullying = has(q, /bully|bullied|bullies|bullying|classmate|schoolmate|picked on|teased|mocked|name calling|excluded|exclude me|rumou?r|harass|校园欺凌|学生欺凌|霸凌|被欺负|欺负|嘲笑|排挤|造谣|กลั่นแกล้ง|เพื่อนร่วมชั้น|รังแก|ล้อเลียน|กีดกัน/);
  const child = has(q, /child abuse|child neglect|neglect|parent hit|guardian|caregiver|under 18|儿童|孩子|未成年|监护人|照顾者|เด็ก|เยาวชน|ผู้ปกครอง|ผู้ดูแล|ทารุณ|ละเลย/);
  const schoolThreat = has(q, /(teacher|school).*(threat|threaten|force|coerc|beat)|(?:threat|threaten|force|coerc|beat).*(teacher|school)|老师.*(威胁|强迫|打)|教师.*(威胁|强迫|打)|(威胁|强迫|打).*(老师|教师)|ครู.*(ขู่|บังคับ|ทำร้าย)|(ขู่|บังคับ|ทำร้าย).*ครู/);
  const teacherTouch = has(q, /(teacher|school).*(touch|touching|grab|rub|kiss)|(?:touch|touching|grab|rub|kiss).*(teacher|school)|老师.*(摸|碰|触碰|拉|亲)|教师.*(摸|碰|触碰|拉|亲)|(摸|碰|触碰|拉|亲).*(老师|教师)|ครู.*(จับ|แตะ|ลูบ|จูบ|สัมผัส)|(จับ|แตะ|ลูบ|จูบ|สัมผัส).*ครู/);

  if (q.length < 2) {
    return {
      heading: "Here is a careful place to start",
      comfort: "It is okay not to know the legal words. We can take this one small step at a time.",
      understood: "Justice Hub has received your question. A little more detail would help match it to a specific verified legal source.",
      relevant: "The right information can depend on what happened, whether it is still happening, who is involved, and the location connected with it.",
      law: { title: "No specific verified law selected yet", article: "DEMO / PROTOTYPE", explanation: "Justice Hub will not guess a legal article without a clear topic. Add one sentence about what happened and it can match a more specific topic.", vocabulary: ["Evidence: messages, screenshots, dates, links, or documents that may help explain what happened.", "Trusted adult: a safe parent, teacher, counsellor, guardian, or another responsible person."] },
      steps: ["Write one or two sentences about what happened, without names or private details.", "Say whether it is still happening or whether anyone is unsafe.", "For immediate danger, use the emergency number shown for your selected country."],
    };
  }

  if (sexualAssault) return sexualAssaultResponse(location);

  if (thailand && domestic) {
    return { heading: "Your safety and support may matter right now", comfort: "I’m sorry this is happening. You deserve support and do not have to manage a frightening situation alone.", emergency: true, understood: "You may be experiencing abuse or violence in a close or family relationship.", relevant: "This may involve family violence, immediate safety, reporting, medical care, social-work support, and protective measures. The safest next step depends on the immediate risk.", law: thailandLaw("Victims of Domestic Violence Protection Act B.E. 2550", "Sections 3, 5, 6 and 10", "Section 3 defines domestic violence as intentional conduct causing, or likely to cause, danger to the body, mind, or health of a family member, including wrongful coercive control. Section 5 provides for notifying a competent official and protects good-faith reporters. Section 6 allows notification verbally, in writing, by telephone, electronically, or another method; it also provides for medical treatment and advice. Section 10 provides for temporary measures to alleviate suffering, which may include keeping the alleged offender away from the family home or victim.", ["Competent official: an official authorised under the law, including certain police or administrative officials.", "Temporary measures: urgent protective steps while a matter is handled."], "https://law.m-society.go.th/law/view/173"), steps: ["If you are in immediate danger or seriously injured, move to a safer place and call 191 or 1669.", "Thailand’s Social Assistance Centre 1300 and Mental Health Hotline 1323 are nationwide support options.", "Keep messages, medical records, photos, or a timeline only if doing so is safe.", "A trusted adult, social worker, police officer, or qualified lawyer can help you decide the safest reporting route."] };
  }

  if (thailand && (harassment || womenWork)) {
    return { heading: "You deserve dignity, safety, and fair treatment", comfort: "No one deserves unwanted behaviour or unfair treatment. You do not have to handle this alone.", emergency: danger, understood: "You may be describing gender-based discrimination, sexual harassment, unwanted contact, or unfair treatment because of gender expression.", relevant: "This may involve Thailand’s gender-equality law, school or workplace reporting, safety, and support services. The exact route depends on the facts.", law: thailandLaw("Gender Equality Act B.E. 2558", "Sections 3, 17 and 18", "Section 3 defines unfair gender discrimination as a direct or indirect distinction, exclusion, or restriction of benefits without legitimate grounds because a person is male, female, or expresses a gender different from their sex at birth. Section 17 prohibits rules, measures, projects, or practices by public bodies, private organisations, or people that constitute unfair gender discrimination. Section 18 gives a person who has suffered, or may suffer, such harm a right to submit a petition, subject to limits in the Act.", ["Gender expression: how a person presents or expresses their gender.", "Unfair discrimination: unequal treatment without a legitimate basis."], "https://ratchakitcha.soc.go.th/documents/2035632.pdf"), steps: ["For immediate danger call 191 or 1669, or tell a trusted adult.", "Keep the words used, dates, messages, witnesses, and any school or workplace response.", "At school tell a trusted adult; at work consider a formal complaint route. Social support is available through 1300."] };
  }

  if (thailand && teacherTouch) {
    return { heading: "Unwanted touching by a teacher needs a safe response", comfort: "You did the right thing by asking. You do not have to handle unwanted touching from a teacher on your own.", emergency: true, understood: "You may be describing a teacher touching you in a way that feels unwanted, unsafe, or harmful.", relevant: "If you are under 18, Thailand’s child-protection law and school safeguarding responsibilities may be relevant. The safest next step depends on whether there is an immediate risk or injury.", law: thailandLaw("Thailand Child Protection Act B.E. 2546", "Sections 22, 26 and 29", "Section 22 says treatment of a child must give primary importance to the child’s best interests. Section 26 prohibits acts or omissions that torture a child’s physical or mental state. Section 29 says that a person who finds a child needing assistance or welfare protection should give preliminary aid and promptly notify a competent official, administrative official, police officer, or person responsible for child welfare; good-faith reporters are protected.", ["Welfare protection: support intended to protect a child’s safety and wellbeing.", "Good-faith report: a report made honestly to seek help, not to harm someone.", "Trusted adult: a safe parent, guardian, counsellor, teacher, or another responsible adult."], "https://ratchakitcha.soc.go.th/documents/130679.pdf"), steps: ["If you think you may be hurt now, move toward trusted adults or a public safe place and call 191. For urgent medical care, call 1669.", "Tell a parent or guardian you trust, another teacher, school counsellor, school leader, or the nationwide Social Assistance Centre 1300.", "Write the date, time, place, what happened, and witnesses. Save messages only if safe. Do not meet the teacher alone if that feels unsafe.", "Ask the school or a trusted adult to record your report and explain how it will protect you. Child and family support is also available through 1579."] };
  }

  if (thailand && schoolThreat) {
    return { heading: "A teacher’s threat is serious, and you deserve safe support", comfort: "You did the right thing by telling someone. You should not have to handle a threat from a teacher by yourself.", emergency: true, understood: "You may be describing a teacher threatening, pressuring, or trying to force you to do something you do not want to do. You may be worried about being hurt or punished.", relevant: "If you are under 18, Thailand’s child-protection law, school safeguarding responsibilities, and immediate safety support may be relevant. The safest reporting route depends on whether there is an immediate threat or injury.", law: thailandLaw("Thailand Child Protection Act B.E. 2546", "Sections 22, 26 and 29", "Section 22 says treatment of a child must give primary importance to the child’s best interests. Section 26 prohibits acts or omissions that torture a child’s physical or mental state. Section 29 says a person who finds a child needing assistance or welfare protection should give preliminary aid and promptly notify a competent official, administrative official, police officer, or person responsible for child welfare; good-faith reporters are protected.", ["Coercion: pressuring or threatening someone to make them do something.", "Welfare protection: support intended to protect a child’s safety and wellbeing.", "Good-faith report: a report made honestly to seek help, not to harm someone."], "https://law.m-society.go.th/law2016/uploads/lawfile/591d5c22188a8.pdf"), steps: ["If you think you may be hurt now, move toward trusted adults or a public safe place and call 191. For urgent medical care, call 1669.", "Tell a parent or guardian you trust, another teacher, school counsellor, school leader, or the nationwide Social Assistance Centre 1300.", "Write down the exact threat, date, time, place, witnesses, and messages. Do not meet the teacher alone if that feels unsafe.", "Ask the school or a trusted adult to record your report and explain how it will protect you. Child and family support is also available through 1579."] };
  }

  if (thailand && bullying) {
    return { heading: "You deserve safety and support at school", comfort: "Repeated bullying is not your fault. You deserve to be heard and supported.", understood: "You may be describing repeated bullying, exclusion, threats, harassment, or harmful sharing by another student.", relevant: "For a person under 18, child-protection rules, school safety procedures, and possibly online-reporting routes may be relevant. The facts and age matter.", law: thailandLaw("Thailand Child Protection Act B.E. 2546", "Sections 22, 26 and 27", "Section 22 says treatment of a child must give primary importance to the child’s best interests and must not be unfairly discriminatory. Section 26 prohibits acts or omissions that torture a child’s physical or mental state. Section 27 prohibits disseminating information about a child with intent to harm the child’s mind, reputation, prestige, or other interests.", ["Best interests of the child: the child’s welfare should be the main consideration.", "Disseminate: spread information through media or technology."], "https://law.m-society.go.th/law2016/uploads/lawfile/591d5c22188a8.pdf"), steps: ["Tell a parent, teacher, counsellor, or school safeguarding contact and ask them to record your report.", "Save the full messages, usernames, dates, places, witnesses, and a timeline.", "Ask how the school will stop the behaviour, protect your safety, and provide support.", "For immediate danger call 191; for child and family support, 1300 or 1579 may help."] };
  }

  if (thailand && child) {
    return { heading: "A child’s safety and welfare may need support", comfort: "It matters that you asked. You do not have to work out a difficult situation alone.", emergency: true, understood: "You may be describing possible harm, neglect, coercion, or unsafe care involving a child or young person.", relevant: "If the person is under 18, child-protection law and immediate welfare support may be relevant. The exact action depends on safety and the full facts.", law: thailandLaw("Thailand Child Protection Act B.E. 2546", "Sections 22, 26 and 29", "Section 22 requires treatment of a child to give primary importance to the child’s best interests and prohibits unfair discrimination. Section 26 prohibits acts or omissions that torture a child’s physical or mental state. Section 29 says a person who finds a child needing assistance or welfare protection should give preliminary aid and promptly notify a competent official, administrative official, police officer, or person responsible for child welfare; good-faith reporters are protected.", ["Welfare protection: support intended to protect a child’s safety and wellbeing.", "Good-faith report: a report made honestly, not to cause harm."], "https://law.m-society.go.th/law2016/uploads/lawfile/591d5c22188a8.pdf"), steps: ["For immediate danger call 191; for urgent medical care call 1669.", "Tell a trusted adult, social worker, or the nationwide 1300 service so a safe next step can be considered.", "Keep dates, messages, and relevant information only if that does not put the child at greater risk."] };
  }

  if (thailand && privacy) {
    return { heading: "Your photo or personal information may need protection", comfort: "You are doing the right thing by asking before reacting quickly. Take one calm, safe step at a time.", understood: "You may be describing a photo, video, contact detail, location, account, or other information that could identify you being collected, used, or shared.", relevant: "If the information can identify a person and is handled by an organisation, business, school, or platform, Thailand’s Personal Data Protection Act may be relevant alongside platform rules. Whether a particular right applies depends on the facts and legal exceptions.", law: thailandLaw("Thailand Personal Data Protection Act B.E. 2562", "Sections 19, 20, 30 and 33", "Section 19 sets conditions for consent, including that a request must be clear and freely given. Section 20 has additional rules where the data subject is a minor. Section 30 provides a right to request access to and obtain a copy of personal data in specified circumstances. Section 33 provides a right to request erasure, destruction, or anonymisation in specified circumstances. The Act has exceptions, so these sections do not by themselves decide one case.", ["Personal data: information relating to a person who can be identified directly or indirectly.", "Consent: clear, freely given permission.", "Erasure: removing or destroying personal data, where the legal conditions are met."], "https://ratchakitcha.soc.go.th/documents/17082307.pdf"), steps: ["Save screenshots, links, usernames, dates, and messages before content changes.", "Use the privacy, safety, or reporting route offered by the platform and keep a record of your report.", "If you are under 18, tell a trusted adult. For immediate threats call 191; for social support call 1300."] };
  }

  if (china && bullying) {
    return {
      heading: "You deserve safety and support at school",
      comfort: "Being repeatedly bullied is not your fault. Telling a trusted adult is a strong first step.",
      understood: "You may be describing repeated bullying, exclusion, threats, harassment, or harmful sharing by another student.",
      relevant: "This may involve student bullying, school safety, and the school’s responsibility to respond. The exact action depends on the facts and what is safe for you.",
      law: chinaLaw(
        "Law of the People’s Republic of China on the Protection of Minors",
        "Article 39",
        "Article 39 says schools must establish systems to prevent and control student bullying. Schools must immediately stop bullying, notify the parents or other guardians of both students, and give timely psychological counselling, education, and guidance.",
        ["Student bullying: repeated harmful behaviour toward a student.", "School safety plan: practical arrangements to reduce risk at school."],
        "https://www.moe.gov.cn/jyb_sjzl/sjzl_zcfg/zcfg_qtxgfl/202110/t20211025_574798.html"
      ),
      steps: ["Tell a parent, teacher, counsellor, or school safety person and ask them to record your report.", "Save screenshots, dates, places, witnesses, and a short record of each incident.", "Ask the school how it will stop the behaviour, make a safety plan, and support you.", "For immediate danger call 110; for legal-information support call 12348."],
    };
  }

  if (china && teacherTouch) {
    return {
      heading: "Unwanted touching by a teacher needs a safe response",
      comfort: "You did the right thing by asking. You do not have to deal with unwanted touching from a teacher on your own.",
      emergency: true,
      understood: "You may be describing a teacher touching you in a way that feels unwanted, unsafe, or sexual.",
      relevant: "If the touching was unwanted and sexual in nature, China’s Civil Code may be relevant. A school also has a responsibility to take reasonable measures to prevent and stop sexual harassment. The exact legal outcome depends on the full facts.",
      law: chinaLaw(
        "Civil Code of the People’s Republic of China",
        "Article 1010",
        "Article 1010 says that where a person sexually harasses another person against that person’s will by words, images, physical acts, or other means, the victim has the right to request that the actor bear civil liability. It also says that organs, enterprises, schools, and other units should take reasonable measures to prevent and stop sexual harassment through systems, complaint channels, investigations, and handling.",
        ["Sexual harassment: unwanted conduct of a sexual nature, including physical acts.", "Consent: freely given permission; it should not be assumed from silence.", "Civil liability: legal responsibility that may include stopping harmful conduct or compensating harm."],
        "https://wb.flk.npc.gov.cn/flfg/PDF/bd53dd912c1048f2aecbaa229238334b.pdf"
      ),
      steps: ["If you feel unsafe or at immediate risk, move to a safer place, call 110 or 120, or tell a trusted adult.", "Tell a parent or guardian you trust, school counsellor, another teacher, or school leader. Do not meet the teacher alone if that feels unsafe.", "Write the date, time, place, what happened, and witnesses. Save messages or information only if safe.", "Ask the school to record your report and explain how it will protect you. You can also use 12348 for legal-information support."],
    };
  }

  if (china && domestic && danger) {
    return {
      heading: "Your safety and support may matter right now",
      comfort: "I’m really sorry this is happening. You deserve support, and you do not have to handle a frightening situation alone.",
      emergency: true,
      understood: "From what you wrote, you may be experiencing abuse in a close or family relationship. Your safety and access to support may be important right now.",
      relevant: "This may involve family violence, personal safety, evidence, support services, and possible court protection. The safest next step depends on the immediate risk and your circumstances.",
      law: chinaLaw(
        "Anti-Domestic Violence Law of the People’s Republic of China",
        "Articles 2, 13, 15, 20, 23 and 32",
        "Article 2 describes domestic violence as physical or mental harm between family members through conduct such as beating, binding, harm, restricting personal freedom, or repeated verbal abuse and intimidation. Article 13 allows a victim, legal representative, or close relative to seek help from relevant organisations. Article 15 says police should promptly attend, stop violence, investigate, collect evidence, and help with medical or injury assessment when needed. Article 20 says certain police and injury records may be used as evidence. Article 23 says a people’s court shall accept an application for a personal safety protection order where a person has suffered domestic violence or faces a real danger of it. Article 32 addresses service and implementation of a protection order.",
        ["Personal safety protection order: a court order intended to help protect a person facing domestic violence or a real danger of it.", "Police attendance record: a record made when police respond to a report."],
        "https://www.npc.gov.cn/npc/c2/c10134/201905/t20190521_260193.html"
      ),
      steps: ["If you are in immediate danger, move to a safer place and contact 110, 120, or a trusted adult now.", "If it is safe, save messages, dates, photos, medical records, or links. Do not collect evidence if doing so makes you less safe.", "Use 12348 or a qualified local professional to discuss the safest next step."],
    };
  }

  if (china && (harassment || womenWork)) {
    const isHarassment = harassment;
    return {
      heading: isHarassment ? "You deserve safety, dignity, and support" : "This may involve equal treatment and women’s rights",
      comfort: isHarassment ? "I’m sorry this happened. You did nothing to deserve unwanted behaviour, and you do not have to deal with it alone." : "You deserve to be treated fairly. Keeping calm records can help you ask for the right support.",
      understood: isHarassment ? "You may be describing unwanted sexual conduct, messages, images, comments, or physical contact." : "You may be describing unequal treatment connected with pregnancy, maternity leave, breastfeeding, recruitment, or work.",
      relevant: isHarassment ? "This may involve sexual-harassment prevention, safety, privacy, dignity, and the responsibilities of a school or employer." : "This may involve protection against certain unequal treatment in recruitment or employment. The exact outcome depends on the facts and evidence.",
      law: chinaLaw(
        "Law of the People’s Republic of China on the Protection of Women’s Rights and Interests",
        isHarassment ? "Articles 23, 24, 25 and 28" : "Articles 43 and 48",
        isHarassment
          ? "Article 23 prohibits sexual harassment against a woman’s will by words, text, images, physical acts, or other means. Article 24 requires schools to take measures to protect female students’ safety and prevent sexual harassment. Article 25 requires employers to take measures to prevent and stop sexual harassment. Article 28 protects women’s rights concerning name, portrait, reputation, honour, privacy, personal information, and other personality rights."
          : "Article 43 lists conduct employers must not use when recruiting women. Article 48 says an employer must not reduce a female worker’s salary or welfare benefits, restrict promotion or evaluation, dismiss her, or unilaterally terminate an employment contract because of marriage, pregnancy, maternity leave, or breastfeeding.",
        ["Sexual harassment: unwanted conduct of a sexual nature, including words, messages, images, or physical acts.", "Maternity leave: leave connected with giving birth."],
        "https://wb.flk.npc.gov.cn/flfg/PDF/7beea84685184f02979044b09caf7844.pdf"
      ),
      steps: isHarassment
        ? ["If you feel unsafe, contact 110, 120, or a trusted adult.", "If it is safe, save messages, screenshots, dates, and a short timeline.", "Tell a trusted adult or school safeguarding contact; at work, consider the employer’s reporting process and 12348."]
        : ["Keep recruitment notices, contracts, payslips, messages, dates, and written explanations.", "Ask for a written explanation or use an appropriate internal reporting process if safe.", "Use 12348 or a qualified local adviser before relying on a legal conclusion."],
    };
  }

  if (china && elderly) {
    return {
      heading: "An older person may need care and support",
      comfort: "It is kind and important that you are looking for help. You do not need to solve a difficult family situation by yourself.",
      understood: "An older person may need support, care, medical attention, financial help, or protection from neglect or abandonment.",
      relevant: "This may involve family support duties, care, emotional support, basic assistance, or another form of protection. The best route depends on the immediate risk and the person’s needs.",
      law: chinaLaw(
        "Law of the People’s Republic of China on the Protection of the Rights and Interests of the Elderly",
        "Articles 3, 14, 15, 18, 19, 31 and 73",
        "Article 2 defines an elderly person in this law as a citizen aged 60 or above. Article 3 prohibits discrimination, insult, abuse, and abandonment of older people. Articles 14 and 15 require supporters to provide financial support, care, emotional comfort, and timely treatment or care when needed. Article 18 says family members should care for an older person’s emotional needs and must not neglect or cold-shoulder them. Article 19 says a supporter cannot refuse support duties by renouncing inheritance rights. Article 31 provides for basic assistance for older people in hardship. Article 73 allows an older person or their agent to request help from relevant departments or bring a lawsuit when their rights are infringed.",
        ["Elderly person: in this law, a citizen aged 60 or above.", "Supporter: a person with duties to provide financial support, care, and emotional comfort."],
        "https://wb.flk.npc.gov.cn/flfg/PDF/ffae7894a3e54e478e94a708fd88f318.pdf"
      ),
      steps: ["For immediate danger or urgent medical needs, call 110 or 120, or ask a trusted adult to do so.", "Write down what support or care is missing and keep relevant information if safe.", "Contact 12348 or an appropriate community, social-service, or qualified local professional."],
    };
  }

  if (china && work) {
    return {
      heading: "This may be a China workplace concern",
      comfort: "You are doing something sensible by asking before making a rushed decision. Let’s make the next step clearer.",
      understood: "You may be describing an employment, pay, contract, overtime, safety, or workplace-treatment issue in China.",
      relevant: "The Labour Contract Law may be relevant to an employment relationship. The exact article and outcome depend on your contract, evidence, employer, local rules, and the full facts.",
      law: chinaLaw(
        "Labour Contract Law of the People’s Republic of China",
        "Articles 17, 18 and 77",
        "Article 17 lists matters normally included in a labour contract, including work, location, time, remuneration, social insurance, and safety. Article 18 addresses unclear pay or labour-condition terms. Article 77 says a worker whose lawful rights are infringed may request handling by the relevant department, apply for arbitration, or bring a lawsuit.",
        ["Labour contract: a work agreement between a worker and employer.", "Arbitration: a formal process that may decide certain disputes outside a normal court trial."],
        "https://flk.npc.gov.cn/search"
      ),
      steps: ["Keep your contract, payslips, schedule, messages, and a dated timeline.", "Ask for a clear written explanation from the employer if it feels safe.", "Use 12348, a qualified labour adviser, a trade union, or the relevant local labour authority."],
    };
  }

  if (china && privacy) {
    return {
      heading: "This may involve privacy, an image, or reputation",
      comfort: "You are doing the right thing by asking before reacting quickly. Let’s take one calm next step at a time.",
      understood: "You may be describing an image, personal information, privacy, reputation, or online-content issue in China.",
      relevant: "The Civil Code may be relevant, but the exact article and outcome depend on the full facts, evidence, any consent given, and other laws or platform rules.",
      law: chinaLaw(
        "Civil Code of the People’s Republic of China",
        "Articles 1018, 1019, 1032, 1034 and 1195",
        "Article 1018 says a natural person has portrait rights. Article 1019 says that, unless the law provides otherwise, an organisation or individual must not make, use, or publish another person’s portrait without consent. Article 1032 protects privacy. Article 1034 says personal information is protected by law. Article 1195 allows a right holder to notify an online service provider to take necessary measures such as deletion, blocking, or disconnecting a link, with initial evidence and identity information.",
        ["Portrait right: a person’s right concerning their likeness or image.", "Consent: permission given by the person concerned.", "Personal information: information that can identify a person or reflect personal activities."],
        "https://wb.flk.npc.gov.cn/flfg/PDF/bd53dd912c1048f2aecbaa229238334b.pdf"
      ),
      steps: ["Save screenshots, links, usernames, dates, and messages before content changes.", "Use the platform’s official reporting or removal process and keep a record of your report.", "Use 12348 or a qualified local adviser if you need help applying the law to your situation."],
    };
  }

  return {
    heading: "Here is a careful place to start",
    comfort: "You do not have to figure everything out at once. Start with what you know, and take one clear step at a time.",
    understood: "Justice Hub has recorded your situation and location. You can still take practical next steps while you add details that match a verified legal topic.",
    relevant: "This may involve a law, school rule, workplace policy, platform rule, or local support service. The exact legal topic is not clear enough to name one law without guessing.",
    law: { title: "No specific verified law selected yet", article: "DEMO / PROTOTYPE", explanation: "Justice Hub will not invent a law for a country or topic that does not match one of its verified prototype sources. Add whether this happened at school, home, online, or work for a more specific answer.", vocabulary: ["Verified source: a law or official source checked for this prototype.", "Evidence: messages, screenshots, dates, links, or documents that may help explain what happened."] },
    steps: ["Write down what happened, when, where, and who was involved — without names or private details.", "Save relevant messages, documents, photos, receipts, or links.", "Use the country-specific emergency or support contacts if there is a safety concern or you need next-step help."],
  };
}

function Button({ children, onPress, secondary = false }) {
  return <Pressable onPress={onPress} style={[styles.button, secondary && styles.secondary]}><Text style={styles.buttonText}>{children}</Text></Pressable>;
}

function Card({ title, children, warm = false }) {
  return <View style={[styles.card, warm && styles.warmCard]}><Text style={styles.cardLabel}>{title}</Text>{children}</View>;
}

function Home({ setPage, supporter, purchaseBusy, revenueStatus, onSupport }) {
  return <ScrollView contentContainerStyle={styles.page}>
    <Text style={styles.kicker}>— A CLEARER PLACE TO START</Text>
    <Text style={styles.hero}>How can we help?</Text>
    <Text style={styles.intro}>No jargon. No pressure. Just a calm way to make sense of what’s happening.</Text>
    <View style={styles.stickers}><Text style={styles.sticker}>💛 You’re not alone.</Text><Text style={styles.sticker}>🌿 One step at a time.</Text><Text style={styles.sticker}>✨ It’s okay to ask.</Text></View>
    <View style={styles.heroCard}><Text style={styles.heroCardTitle}>Know your rights.{"\n"}Know where to start.</Text><Text style={styles.intro}>You do not have to figure everything out alone. Start with what happened and we will take one step at a time.</Text><Button onPress={() => setPage("ask")}>Ask a Question →</Button></View>
    <Card title="OPTIONAL COMPETITION DEMO" warm>
      <Text style={styles.lawTitle}>{supporter ? "💛 Thank you for supporting Justice Hub" : "Support Justice Hub — Demo Purchase"}</Text>
      <Text style={styles.text}>{supporter ? "Your RevenueCat Test Store purchase was recorded. All legal, safety, and emergency-help features remain free for every student." : "This is a no-real-money RevenueCat Test Store demonstration for the competition. It never limits legal information, safety guidance, or emergency contacts."}</Text>
      {!supporter ? <Button secondary onPress={onSupport}>{purchaseBusy ? "Connecting to RevenueCat…" : "Run Supporter Demo →"}</Button> : null}
      {!supporter && revenueStatus ? <Text style={styles.purchaseNote}>{revenueStatus}</Text> : null}
    </Card>
    <Text style={styles.sectionTitle}>Three simple steps</Text>
    <Card title="💬  ASK A QUESTION"><Text style={styles.text}>Tell us what happened, in your own words. Start anywhere you feel comfortable.</Text></Card>
    <Card title="📖  UNDERSTAND THE LAW"><Text style={styles.text}>Make complex legal information easier to understand, one clear idea at a time.</Text></Card>
    <Card title="↗  FIND YOUR NEXT STEP"><Text style={styles.text}>Explore possible actions, support services, and resources that could help.</Text></Card>
  </ScrollView>;
}

function Ask({ question, setQuestion, location, setLocation, setPage, setResponse }) {
  const [error, setError] = useState("");
  const update = (key, value) => setLocation({ ...location, [key]: value });
  function submit() {
    if (!question.trim()) return setError("Please describe what happened first.");
    if (!location.country.trim()) return setError("Please enter a country so Justice Hub can use location context.");
    setResponse(createResponse(question, location));
    setPage("answer");
  }
  return <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
    <Text style={styles.kicker}>— TELL YOUR STORY</Text><Text style={styles.hero}>What happened?</Text>
    <Text style={styles.intro}>Describe your situation in your own words. You do not need to know legal terms.</Text>
    <View style={styles.gentle}><Text style={styles.gentleText}>💛 You can share only what feels safe. Do not include passwords, ID numbers, or a home address.</Text></View>
    <TextInput value={question} onChangeText={setQuestion} multiline placeholder="Describe what happened…" placeholderTextColor={C.muted} style={styles.question} textAlignVertical="top" />
    <View style={styles.locationBox}><Text style={styles.locationTitle}>Where are you located?</Text><Text style={styles.locationHelp}>Legal rights and rules can be different depending on location.</Text>
      <View style={styles.countryRow}><Pressable onPress={() => update("country", "China")} style={[styles.countryChip, location.country === "China" && styles.countryChipSelected]}><Text style={styles.countryChipText}>China</Text></Pressable><Pressable onPress={() => update("country", "Thailand")} style={[styles.countryChip, location.country === "Thailand" && styles.countryChipSelected]}><Text style={styles.countryChipText}>Thailand</Text></Pressable></View>
      <TextInput value={location.province} onChangeText={(v) => update("province", v)} placeholder="Province / State (example: Beijing, Hebei, Shandong)" placeholderTextColor={C.muted} style={styles.input} />
      <TextInput value={location.city} onChangeText={(v) => update("city", v)} placeholder="City" placeholderTextColor={C.muted} style={styles.input} />
      <TextInput value={location.district} onChangeText={(v) => update("district", v)} placeholder="District / Area" placeholderTextColor={C.muted} style={styles.input} />
    </View>
    {error ? <Text style={styles.error}>{error}</Text> : null}
    <Button onPress={submit}>Get Guidance →</Button>
  </ScrollView>;
}

function Answer({ response, location, setPage }) {
  if (!response) return <View style={styles.empty}><Text style={styles.hero}>Ask a question first</Text><Button onPress={() => setPage("ask")}>Ask a Question</Button></View>;
  return <ScrollView contentContainerStyle={styles.page}>
    <View style={styles.responseHead}><Text style={styles.pill}>DEMO / PROTOTYPE</Text><Text style={styles.responseTitle}>{response.heading}</Text><Text style={styles.locationLine}>Location used: {locationText(location)}</Text></View>
    <View style={styles.comfort}><Text style={styles.comfortLabel}>💛 A gentle reminder</Text><Text style={styles.comfortText}>{response.comfort}</Text></View>
    {response.emergency ? <View style={styles.emergency}><Text style={styles.emergencyTitle}>If you are in immediate danger</Text><Text style={styles.text}>{location.country === "Thailand" ? "Move to a safer place and call 191 or 1669, or tell a trusted adult now." : "Move to a safer place and call 110, 120, or a trusted adult now."}</Text></View> : null}
    <Card title="WHAT I UNDERSTAND"><Text style={styles.text}>{response.understood}</Text></Card>
    <Card title="WHAT MAY BE RELEVANT"><Text style={styles.text}>{response.relevant}</Text></Card>
    <Card title="RELEVANT LAW" warm><Text style={styles.pill}>{response.law.verified ? response.law.country === "Thailand" ? "VERIFIED THAILAND SOURCE" : "VERIFIED CHINA SOURCE" : "NO LAW INVENTED"}</Text><Text style={styles.lawTitle}>{response.law.title}</Text><Text style={styles.text}>{response.law.explanation}</Text>{response.law.url ? <Pressable onPress={() => Linking.openURL(response.law.url)}><Text style={styles.link}>Open official source ↗</Text></Pressable> : null}</Card>
    {response.law.vocabulary ? <Card title="IMPORTANT VOCABULARY">{response.law.vocabulary.map((item) => <Text key={item} style={styles.bullet}>✦ {item}</Text>)}</Card> : null}
    <Card title="WHAT YOU CAN DO NEXT">{response.steps.map((step, index) => <View key={step} style={styles.step}><Text style={styles.stepNumber}>{index + 1}</Text><Text style={styles.text}>{step}</Text></View>)}</Card>
    {response.evidenceSafety ? <Card title="IF YOU WANT TO PRESERVE EVIDENCE" warm><Text style={styles.text}>{response.evidenceSafety}</Text></Card> : null}
    <Card title="FIND REAL HELP"><Text style={styles.text}>{location.country === "Thailand" ? "Use Find Real Help for Thailand’s nationwide emergency, social-support, mental-health, and child-protection numbers. A future version will add verified city-specific organisations." : "Use Find Real Help for nationwide China emergency and legal-information numbers. A future version will add verified city-specific organisations."}</Text><Button secondary onPress={() => setPage("help")}>Open help resources</Button></Card>
    <View style={styles.disclaimer}><Text style={styles.disclaimerTitle}>Justice Hub is not meant to replace a lawyer.</Text><Text style={styles.text}>This information is for general guidance and does not replace professional legal advice.</Text></View>
    <Button onPress={() => setPage("ask")}>Ask another question</Button>
  </ScrollView>;
}

function Help({ location }) {
  const contacts = supportContacts(location);
  const thailand = location.country === "Thailand";
  return <ScrollView contentContainerStyle={styles.page}><Text style={styles.kicker}>— FIND REAL HELP</Text><Text style={styles.hero}>Support that fits your situation</Text><Text style={styles.intro}>Location: {locationText(location)}</Text>
    {contacts.map(([number, title, body]) => <View key={number} style={styles.contact}><Text style={styles.contactNumber}>{number}</Text><View style={{ flex: 1 }}><Text style={styles.contactTitle}>{title}</Text><Text style={styles.text}>{body}</Text><Pressable onPress={() => Linking.openURL(`tel:${number}`)}><Text style={styles.link}>Call {number} ↗</Text></Pressable></View></View>)}
    <Card title={thailand ? "OFFICIAL THAILAND INFORMATION" : "OFFICIAL CHINA SERVICE"}><Text style={styles.lawTitle}>{thailand ? "Thailand government emergency and health contacts" : "China Legal Services Network (12348)"}</Text><Text style={styles.text}>{thailand ? "Open the official Thailand government contact list. Justice Hub does not invent city-specific lawyer, police-station, or hospital contacts." : "Use the official service to look for legal aid, law firms, practising lawyers, mediation, and public legal services. Justice Hub does not invent lawyer names or contacts."}</Text><Pressable onPress={() => Linking.openURL(thailand ? "https://www.thailand.go.th/public/issue-focus-detail/003_004" : "https://zwfw.12348.gov.cn/qjd")}><Text style={styles.link}>{thailand ? "Open official Thailand contacts ↗" : "Open official 12348 service ↗"}</Text></Pressable></Card>
  </ScrollView>;
}

export default function App() {
  const [page, setPage] = useState("home");
  const [question, setQuestion] = useState("");
  const [location, setLocation] = useState({ country: "China", province: "", city: "", district: "" });
  const [response, setResponse] = useState(null);
  const [supporter, setSupporter] = useState(false);
  const [purchaseBusy, setPurchaseBusy] = useState(false);
  const [revenueStatus, setRevenueStatus] = useState("");

  useEffect(() => {
    let subscribed = true;
    async function connectRevenueCat() {
      if (!REVENUECAT_TEST_KEY) {
        if (subscribed) setRevenueStatus("Add your Test Store key to .env before running the demo.");
        return;
      }
      try {
        Purchases.setLogLevel(LOG_LEVEL.WARN);
        Purchases.configure({ apiKey: REVENUECAT_TEST_KEY });
        const customerInfo = await Purchases.getCustomerInfo();
        if (subscribed && Object.keys(customerInfo.entitlements.active).length > 0) setSupporter(true);
      } catch (error) {
        if (subscribed) setRevenueStatus("RevenueCat is not ready yet. Use a development build, not Expo Go.");
      }
    }
    connectRevenueCat();
    return () => { subscribed = false; };
  }, []);

  async function runSupporterDemo() {
    if (!REVENUECAT_TEST_KEY) {
      Alert.alert("Add your Test Store key", "Create a local .env file with EXPO_PUBLIC_REVENUECAT_TEST_API_KEY, then restart Expo.");
      return;
    }
    setPurchaseBusy(true);
    setRevenueStatus("");
    try {
      const offerings = await Purchases.getOfferings();
      const selectedPackage = offerings.current?.availablePackages.find((item) => item.identifier === "justice_hub_supporter_demo");
      if (!selectedPackage) {
        throw new Error("No RevenueCat package was found. Confirm the default offering includes supporter_demo.");
      }
      const { customerInfo } = await Purchases.purchasePackage(selectedPackage);
      if (Object.keys(customerInfo.entitlements.active).length > 0) {
        setSupporter(true);
        Alert.alert("Demo complete", "Thank you for supporting Justice Hub. No real money was charged.");
      } else {
        setRevenueStatus("The purchase finished, but no entitlement was granted. Confirm the product is attached to Justice Hub Pro.");
      }
    } catch (error) {
      if (error?.userCancelled) {
        setRevenueStatus("Demo purchase cancelled. You can try again whenever you are ready.");
      } else {
        setRevenueStatus(error?.message || "RevenueCat could not complete the demo yet.");
      }
    } finally {
      setPurchaseBusy(false);
    }
  }

  return <SafeAreaView style={styles.safe}><StatusBar barStyle="dark-content" backgroundColor={C.cream} />
    <View style={styles.header}><Image source={logo} resizeMode="contain" style={styles.logo} /><View><Text style={styles.brand}>Justice Hub</Text><Text style={styles.caption}>Student legal information</Text></View></View>
    <View style={styles.body}>{page === "home" ? <Home setPage={setPage} supporter={supporter} purchaseBusy={purchaseBusy} revenueStatus={revenueStatus} onSupport={runSupporterDemo} /> : null}{page === "ask" ? <Ask question={question} setQuestion={setQuestion} location={location} setLocation={setLocation} setPage={setPage} setResponse={setResponse} /> : null}{page === "answer" ? <Answer response={response} location={location} setPage={setPage} /> : null}{page === "help" ? <Help location={location} /> : null}</View>
    <View style={styles.nav}><Pressable onPress={() => setPage("home")}><Text style={[styles.navText, page === "home" && styles.active]}>Home</Text></Pressable><Pressable onPress={() => setPage("ask")}><Text style={[styles.navText, page === "ask" && styles.active]}>Ask</Text></Pressable><Pressable onPress={() => setPage("help")}><Text style={[styles.navText, page === "help" && styles.active]}>Help</Text></Pressable></View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.cream }, body: { flex: 1 }, page: { padding: 22, paddingBottom: 28 }, header: { alignItems: "center", backgroundColor: C.cream, borderBottomColor: C.line, borderBottomWidth: 1, flexDirection: "row", padding: 12 }, logo: { backgroundColor: C.pale, borderRadius: 12, height: 50, marginRight: 10, width: 50 }, brand: { color: C.brown, fontSize: 19, fontWeight: "900" }, caption: { color: C.muted, fontSize: 12 }, kicker: { color: C.gold, fontSize: 11, fontWeight: "900", letterSpacing: 1.2, marginBottom: 12 }, hero: { color: C.brown, fontFamily: "Georgia", fontSize: 36, fontWeight: "700", lineHeight: 42 }, intro: { color: C.muted, fontSize: 15, lineHeight: 22, marginBottom: 16, marginTop: 9 }, stickers: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 }, sticker: { backgroundColor: C.white, borderColor: C.line, borderRadius: 18, borderWidth: 1, color: C.brown, fontSize: 12, fontWeight: "800", marginBottom: 7, marginRight: 7, paddingHorizontal: 9, paddingVertical: 7 }, heroCard: { backgroundColor: C.pale, borderRadius: 22, marginTop: 7, padding: 20 }, heroCardTitle: { color: C.brown, fontFamily: "Georgia", fontSize: 29, fontWeight: "700", lineHeight: 35 }, sectionTitle: { color: C.brown, fontFamily: "Georgia", fontSize: 27, fontWeight: "700", marginBottom: 10, marginTop: 25 }, button: { alignItems: "center", backgroundColor: C.honey, borderColor: C.gold, borderRadius: 14, borderWidth: 1, marginTop: 12, minHeight: 52, justifyContent: "center", paddingHorizontal: 15 }, secondary: { backgroundColor: C.white }, buttonText: { color: C.brown, fontSize: 15, fontWeight: "900" }, card: { backgroundColor: C.white, borderColor: C.line, borderRadius: 18, borderWidth: 1, marginBottom: 12, padding: 17 }, warmCard: { backgroundColor: C.parchment, borderColor: C.honey }, cardLabel: { color: C.gold, fontSize: 11, fontWeight: "900", letterSpacing: 1, marginBottom: 9 }, text: { color: C.brown, fontSize: 14, lineHeight: 21 }, purchaseNote: { color: C.muted, fontSize: 12, lineHeight: 18, marginTop: 10 }, gentle: { backgroundColor: C.pale, borderRadius: 15, marginBottom: 13, padding: 13 }, gentleText: { color: C.brown, fontSize: 13, fontWeight: "700", lineHeight: 19 }, question: { backgroundColor: C.white, borderColor: C.line, borderRadius: 17, borderWidth: 1, color: C.brown, fontSize: 16, minHeight: 155, padding: 15 }, locationBox: { backgroundColor: C.parchment, borderRadius: 19, marginVertical: 16, padding: 16 }, locationTitle: { color: C.brown, fontFamily: "Georgia", fontSize: 22, fontWeight: "700" }, locationHelp: { color: C.muted, fontSize: 13, lineHeight: 19, marginBottom: 8, marginTop: 4 }, countryRow: { flexDirection: "row" }, countryChip: { backgroundColor: C.white, borderColor: C.honey, borderRadius: 16, borderWidth: 1, marginBottom: 8, marginRight: 8, paddingHorizontal: 11, paddingVertical: 7 }, countryChipSelected: { backgroundColor: C.honey, borderColor: C.gold }, countryChipText: { color: C.brown, fontSize: 13, fontWeight: "800" }, input: { backgroundColor: C.white, borderColor: C.line, borderRadius: 12, borderWidth: 1, color: C.brown, fontSize: 14, marginTop: 8, minHeight: 47, paddingHorizontal: 12 }, error: { color: C.safety, fontSize: 13, fontWeight: "800", marginBottom: 8 }, responseHead: { backgroundColor: C.pale, borderRadius: 22, marginBottom: 12, padding: 19 }, pill: { alignSelf: "flex-start", backgroundColor: C.honey, borderRadius: 16, color: C.brown, fontSize: 10, fontWeight: "900", overflow: "hidden", paddingHorizontal: 8, paddingVertical: 5 }, responseTitle: { color: C.brown, fontFamily: "Georgia", fontSize: 28, fontWeight: "700", lineHeight: 34, marginTop: 10 }, locationLine: { color: C.muted, fontSize: 12, marginTop: 7 }, comfort: { backgroundColor: C.white, borderColor: C.honey, borderRadius: 17, borderWidth: 1, marginBottom: 12, padding: 16 }, comfortLabel: { color: C.brown, fontSize: 12, fontWeight: "900", marginBottom: 7 }, comfortText: { color: C.brown, fontFamily: "Georgia", fontSize: 17, lineHeight: 24 }, emergency: { backgroundColor: "#F8E0D0", borderColor: "#D9A789", borderRadius: 17, borderWidth: 1, marginBottom: 12, padding: 16 }, emergencyTitle: { color: C.safety, fontSize: 16, fontWeight: "900", marginBottom: 5 }, lawTitle: { color: C.brown, fontFamily: "Georgia", fontSize: 20, fontWeight: "700", lineHeight: 25, marginBottom: 8, marginTop: 10 }, link: { color: C.gold, fontSize: 13, fontWeight: "900", marginTop: 10, textDecorationLine: "underline" }, bullet: { color: C.brown, fontSize: 14, lineHeight: 21, marginBottom: 8 }, step: { alignItems: "flex-start", flexDirection: "row", marginBottom: 12 }, stepNumber: { backgroundColor: C.pale, borderRadius: 16, color: C.brown, fontSize: 12, fontWeight: "900", marginRight: 9, overflow: "hidden", paddingHorizontal: 8, paddingVertical: 5 }, disclaimer: { backgroundColor: C.cream, borderColor: C.line, borderRadius: 16, borderWidth: 1, marginBottom: 12, padding: 16 }, disclaimerTitle: { color: C.brown, fontSize: 14, fontWeight: "900", marginBottom: 5 }, contact: { alignItems: "flex-start", backgroundColor: C.white, borderColor: C.line, borderRadius: 17, borderWidth: 1, flexDirection: "row", marginBottom: 10, padding: 15 }, contactNumber: { backgroundColor: C.pale, borderRadius: 18, color: C.brown, fontSize: 19, fontWeight: "900", marginRight: 11, overflow: "hidden", paddingHorizontal: 8, paddingVertical: 7 }, contactTitle: { color: C.brown, fontSize: 15, fontWeight: "900", marginBottom: 3 }, nav: { backgroundColor: C.white, borderTopColor: C.line, borderTopWidth: 1, flexDirection: "row", justifyContent: "space-around", paddingBottom: 10, paddingTop: 10 }, navText: { color: C.muted, fontSize: 13, fontWeight: "800", minWidth: 62, textAlign: "center" }, active: { color: C.gold }, empty: { alignItems: "center", flex: 1, justifyContent: "center", padding: 25 },
});
