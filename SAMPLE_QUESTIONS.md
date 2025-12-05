# Sample Questions to Test Your Chat Bot

Use these questions to test different features of your AI customer support bot.

## 🟢 Simple Questions (Basic Functionality)

1. **Hello**
2. **Hi, how can you help me?**
3. **What services do you offer?**
4. **Can you help me?**
5. **I need assistance**

## 📋 FAQ-Related Questions

6. **How do I reset my password?**
7. **What are your business hours?**
8. **How can I contact support?**
9. **Do you offer refunds?**
10. **What is your return policy?**
11. **How do I create an account?**
12. **Where can I find my order number?**
13. **How long does shipping take?**
14. **What payment methods do you accept?**
15. **How do I update my profile?**

## 🔄 Contextual Memory Questions (Multi-turn)

16. **What's my order status?**
   - Then follow up: **My order number is #12345**
   - Then: **When will it arrive?**

17. **I forgot my password**
   - Then: **How do I reset it?**
   - Then: **I don't have access to my email**

18. **I want to cancel my subscription**
   - Then: **How do I do that?**
   - Then: **Will I get a refund?**

## ⚠️ Escalation Triggers (Complex Issues)

19. **I'm locked out of my account and I don't have access to my email or phone number**
20. **My payment was charged twice and I need an immediate refund**
21. **I need to speak to a manager about a billing dispute**
22. **There's been unauthorized activity on my account**
23. **I need to cancel my subscription but the website isn't working**
24. **I have a complaint about your service that needs immediate attention**
25. **I need help with something very urgent and complicated**

## 🎯 Product/Service Questions

26. **What products do you sell?**
27. **Do you have a mobile app?**
28. **What features are included in the premium plan?**
29. **How much does your service cost?**
30. **Do you offer a free trial?**

## 🔧 Technical Support Questions

31. **The website is not loading for me**
32. **I can't log in to my account**
33. **How do I change my email address?**
34. **My account was hacked, what should I do?**
35. **I'm getting an error message when I try to checkout**

## 💬 Conversation Flow Tests

36. **Tell me about your company**
   - Follow up: **What services do you provide?**
   - Follow up: **How can I sign up?**

37. **I have a question**
   - Follow up: **About billing**
   - Follow up: **Specifically about refunds**

## 🎭 Edge Cases

38. **asdfghjkl** (random text)
39. **???**
40. **Help me with everything**
41. **I don't know what I need**
42. **Can you do my homework?** (should decline politely)

## 📝 Testing Checklist

Use these to test different features:

- [ ] **Basic response** - Bot responds to simple greetings
- [ ] **FAQ matching** - Bot uses FAQ context when available
- [ ] **Contextual memory** - Bot remembers previous messages in conversation
- [ ] **Escalation detection** - Bot escalates complex issues
- [ ] **Error handling** - Bot handles unclear questions gracefully
- [ ] **Multi-turn conversation** - Bot maintains context across multiple messages

## 💡 Tips for Testing

1. **Start simple** - Test basic functionality first
2. **Test escalation** - Try complex issues to see escalation in action
3. **Test memory** - Ask follow-up questions to test context
4. **Test edge cases** - Try unclear or random inputs
5. **Check browser console** - Look for any errors (F12)

## 🎯 Recommended Test Sequence

1. **"Hello"** - Test basic functionality
2. **"How do I reset my password?"** - Test FAQ handling
3. **"What's my order status?"** → **"Order #12345"** - Test contextual memory
4. **"I'm locked out and need immediate help"** - Test escalation
5. **"Thank you!"** - Test conversation flow

---

**Happy Testing! 🚀**

