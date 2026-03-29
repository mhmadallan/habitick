# Pre-Launch Testing Checklist

Comprehensive testing guide to ensure Habitick is production-ready before app store submission.

---

## Phase 1: Functional Testing (Day 1-2)

### Authentication & Login

- [ ] **Google Sign In**
  - [ ] Sign in works on iOS
  - [ ] Sign in works on Android
  - [ ] Correct user data displayed after login
  - [ ] Logout clears all user data
  - [ ] Can log back in immediately after logout
  - [ ] Multiple accounts work correctly
  - [ ] App handles network timeout gracefully

- [ ] **Session Persistence**
  - [ ] Logged-in state persists after app restart
  - [ ] Logged-in state persists after device reboot
  - [ ] Force quit app doesn't lose session
  - [ ] Session expires after inactivity (if implemented)

### Task Management

- [ ] **Creating Tasks**
  - [ ] Can create new task with all fields
  - [ ] Task saves with correct frequency (daily, weekly, monthly)
  - [ ] Task saves with correct target count
  - [ ] Points calculated correctly
  - [ ] Category selection works
  - [ ] Estimated minutes saved correctly
  - [ ] Cannot create task with empty name
  - [ ] Cannot create task with invalid frequency

- [ ] **Editing Tasks**
  - [ ] Can edit task name
  - [ ] Can change frequency
  - [ ] Can change target times
  - [ ] Can change category
  - [ ] Can change points
  - [ ] Changes save immediately
  - [ ] Cannot edit to invalid state

- [ ] **Deleting Tasks**
  - [ ] Can delete task
  - [ ] Confirmation prompt appears
  - [ ] Task data is removed from all views
  - [ ] Cannot undo deletion (if no undo feature)
  - [ ] Deleted task not visible in lists

- [ ] **Task Display**
  - [ ] All tasks visible in "All Tasks" list
  - [ ] Due tasks appear in "Due" section
  - [ ] Tasks sorted by priority/frequency
  - [ ] Task counts accurate
  - [ ] Empty states show correct messages

### Progress Tracking

- [ ] **Logging Progress**
  - [ ] Can mark task complete for today
  - [ ] Can mark task complete for past days
  - [ ] Can increment task count by more than 1
  - [ ] Correct date recorded for completion
  - [ ] Progress syncs immediately

- [ ] **Progress View Analytics**
  - [ ] Overall completion percentage correct
  - [ ] Per-task completion percentage correct
  - [ ] Streak calculations accurate
  - [ ] Progress charts render without errors
  - [ ] Different time ranges load correctly (week, month, all-time)
  - [ ] Charts are readable on both iOS and Android

- [ ] **Late/Overdue Tasks**
  - [ ] Late tasks show in "Alive" section
  - [ ] Days overdue calculated correctly
  - [ ] Can still log progress on overdue tasks
  - [ ] Marking overdue task complete updates status

### AI Features

- [ ] **AI Encouragement**
  - [ ] Generate encouragement button works
  - [ ] Loading state shows while generating
  - [ ] Response appears within 5 seconds
  - [ ] Message is relevant to progress
  - [ ] No API errors displayed
  - [ ] Works offline (shows cached or disabled message)
  - [ ] Multiple generations show different messages

- [ ] **AI Point Calculation**
  - [ ] Point suggestion appears when creating task
  - [ ] Suggestion is reasonable (5-50 points typically)
  - [ ] Can modify suggested points
  - [ ] Suggestion loads within 3 seconds
  - [ ] Handles API errors gracefully

### Study Items (if applicable)

- [ ] **Adding Study Items**
  - [ ] Can add item to study task
  - [ ] Item saves with correct type (book, verse, word)
  - [ ] Item text saves correctly
  - [ ] Cannot add empty item

- [ ] **Viewing Study Items**
  - [ ] Study items display for correct task
  - [ ] Items show in correct list
  - [ ] Can sort/filter items

- [ ] **Deleting Study Items**
  - [ ] Can delete individual item
  - [ ] Deletion confirmed before executing
  - [ ] Item removed immediately

### Theme/Dark Mode

- [ ] **Theme Toggle**
  - [ ] Dark mode toggle works
  - [ ] Light mode toggle works
  - [ ] Theme persists after app restart
  - [ ] Colors appropriate in both modes
  - [ ] Text readable in both modes
  - [ ] No contrast issues

- [ ] **System Dark Mode**
  - [ ] App respects system dark mode setting
  - [ ] Can override system setting
  - [ ] Theme change is smooth (no flashing)

### Navigation

- [ ] **Tab/Navigation**
  - [ ] All navigation links work
  - [ ] Can navigate between pages without errors
  - [ ] Back button works correctly
  - [ ] Navigation doesn't duplicate screens
  - [ ] Deep links work (if implemented)

---

## Phase 2: Data & Offline Testing (Day 2-3)

### Data Persistence

- [ ] **Database Syncing**
  - [ ] Changes sync to backend
  - [ ] Data persists on server
  - [ ] Conflict resolution works (if multiple devices)
  - [ ] No data loss after sync

- [ ] **Offline Mode**
  - [ ] App works without internet connection
  - [ ] Cannot create new data offline (or queues it)
  - [ ] Notification shown when offline
  - [ ] Data syncs when connection restored
  - [ ] No error messages to user

### Data Integrity

- [ ] **No Data Loss**
  - [ ] Force close doesn't lose pending changes
  - [ ] Kill process doesn't lose data
  - [ ] Battery drain doesn't affect data
  - [ ] Factory reset handles correctly

- [ ] **Data Consistency**
  - [ ] Same user sees same data on iOS and Android
  - [ ] Same user sees same data across sessions
  - [ ] Statistics accurate across all views
  - [ ] No duplicate entries

### Backup/Export (if applicable)

- [ ] **Export Data**
  - [ ] Export function works
  - [ ] Export contains all user data
  - [ ] Export format is readable (JSON, CSV)
  - [ ] Can import/restore exported data

---

## Phase 3: Performance Testing (Day 3)

### Speed & Responsiveness

- [ ] **App Launch**
  - [ ] Cold start < 3 seconds
  - [ ] Warm start < 1 second
  - [ ] Splash screen shows properly
  - [ ] App doesn't freeze on startup

- [ ] **Interactions**
  - [ ] Button taps respond immediately
  - [ ] No lag when scrolling lists
  - [ ] Transitions smooth (no stutter)
  - [ ] Modal dialogs appear immediately
  - [ ] Forms responsive to input

- [ ] **Data Operations**
  - [ ] Creating task < 1 second
  - [ ] Updating task < 1 second
  - [ ] Loading progress screen < 2 seconds
  - [ ] Generating AI response < 5 seconds

### Memory & Battery

- [ ] **Memory Usage**
  - [ ] App doesn't use excessive memory
  - [ ] No memory leaks (check after 1 hour use)
  - [ ] App doesn't crash from memory

- [ ] **Battery Drain**
  - [ ] App doesn't drain battery unusually fast
  - [ ] No excessive background activity
  - [ ] Notifications don't cause excess battery use

- [ ] **Storage**
  - [ ] App doesn't use excessive device storage
  - [ ] Cache files are reasonable size
  - [ ] Database doesn't grow excessively

### Network Performance

- [ ] **Slow Network (3G)**
  - [ ] App works on slow connections
  - [ ] Timeouts handled gracefully
  - [ ] User sees loading indicators
  - [ ] Can retry failed requests

- [ ] **No Network**
  - [ ] Handles offline gracefully
  - [ ] Shows offline message
  - [ ] No forced disconnects
  - [ ] Queues requests for later

---

## Phase 4: Device & Platform Testing (Day 3-4)

### iOS Testing

- [ ] **iPhone Compatibility**
  - [ ] Works on iPhone 12
  - [ ] Works on iPhone 13
  - [ ] Works on iPhone 14
  - [ ] Works on iPhone 15 (if available)
  - [ ] Tested on actual devices, not just simulator

- [ ] **Screen Sizes**
  - [ ] Layouts correct on SE (small)
  - [ ] Layouts correct on regular (6.1")
  - [ ] Layouts correct on Max (6.7")
  - [ ] No cut-off content
  - [ ] Notch/Dynamic Island handled

- [ ] **iOS Versions**
  - [ ] Works on iOS 14 minimum
  - [ ] Works on iOS 15
  - [ ] Works on iOS 16
  - [ ] Works on iOS 17

### Android Testing

- [ ] **Device Compatibility**
  - [ ] Works on Pixel 4 (small screen)
  - [ ] Works on Pixel 6 (standard)
  - [ ] Works on Pixel Tablet (large)
  - [ ] Works on Samsung Galaxy S23
  - [ ] Works on OnePlus device
  - [ ] Tested on actual devices

- [ ] **Screen Sizes**
  - [ ] Works on 5.0" screen
  - [ ] Works on 6.0" screen
  - [ ] Works on 7.0" screen
  - [ ] No stretched/distorted layouts
  - [ ] Touch targets adequate (minimum 48dp)

- [ ] **Android Versions**
  - [ ] Works on Android 11
  - [ ] Works on Android 12
  - [ ] Works on Android 13
  - [ ] Works on Android 14

### System Features

- [ ] **Notifications (if applicable)**
  - [ ] Notifications deliver correctly
  - [ ] Correct icon/title
  - [ ] Can click notification to open app
  - [ ] Can dismiss notifications
  - [ ] Don't appear excessively

- [ ] **Permissions**
  - [ ] Requests necessary permissions
  - [ ] Handles denied permissions gracefully
  - [ ] No crash if permission denied
  - [ ] Can re-enable permissions in settings

- [ ] **Accessibility**
  - [ ] VoiceOver works on iOS
  - [ ] TalkBack works on Android
  - [ ] All interactive elements labeled
  - [ ] Keyboard navigation works
  - [ ] Color contrast adequate

---

## Phase 5: Edge Cases & Error Handling (Day 4)

### Error States

- [ ] **Network Errors**
  - [ ] Shows error message on 404
  - [ ] Shows error message on 500
  - [ ] Shows error message on timeout
  - [ ] Can retry after error
  - [ ] No app crash on API error

- [ ] **Invalid Data**
  - [ ] Handles empty API response
  - [ ] Handles malformed JSON
  - [ ] Shows appropriate error message
  - [ ] Can recover/retry

- [ ] **Edge Cases**
  - [ ] 0 tasks created
  - [ ] 1000+ tasks (performance OK)
  - [ ] Very long task names (no overflow)
  - [ ] Special characters in task names (emoji, non-Latin)
  - [ ] Zero frequency (if applicable)
  - [ ] Very high points (999999)

### Session Edge Cases

- [ ] **Rapid Sessions**
  - [ ] Sign in/out rapidly doesn't crash
  - [ ] Quick reopens work correctly
  - [ ] State consistent after rapid changes

- [ ] **Timeout Scenarios**
  - [ ] Session timeout handled
  - [ ] Re-authentication required
  - [ ] User not logged out abruptly

---

## Phase 6: Security Testing (Day 4)

### Data Security

- [ ] **No Sensitive Data in Logs**
  - [ ] Passwords not logged
  - [ ] Tokens not logged
  - [ ] API keys not exposed
  - [ ] User email not in debug logs

- [ ] **Secure Storage**
  - [ ] Tokens stored securely (keychain/keystore)
  - [ ] No sensitive data in SharedPreferences
  - [ ] No sensitive data in local files

- [ ] **API Security**
  - [ ] Uses HTTPS only
  - [ ] No sensitive data in URLs
  - [ ] No sensitive data in query params
  - [ ] Not vulnerable to MITM attacks

### Authentication Security

- [ ] **Session Security**
  - [ ] Cannot guess session tokens
  - [ ] Tokens expire appropriately
  - [ ] Tokens cannot be reused after logout
  - [ ] Session hijacking not possible

- [ ] **Data Access**
  - [ ] Cannot access other user's data
  - [ ] Can only see own tasks/progress
  - [ ] Backend enforces user isolation

---

## Phase 7: Compliance Testing (Day 4-5)

### Privacy Compliance

- [ ] **Data Collection Disclosure**
  - [ ] Privacy policy explains what's collected
  - [ ] Privacy policy explains why it's collected
  - [ ] Privacy policy explains how it's protected
  - [ ] Privacy policy link works in-app

- [ ] **Data Deletion**
  - [ ] User can delete account
  - [ ] Deletion request processed
  - [ ] All user data deleted from database
  - [ ] Confirmation sent to user

- [ ] **GDPR/CCPA Compliance**
  - [ ] Can export user data
  - [ ] Data format is standard (JSON/CSV)
  - [ ] Export includes all user data
  - [ ] Can complete within 30 days

### App Store Compliance

- [ ] **iOS Requirements**
  - [ ] No crashes on submission
  - [ ] No beta features
  - [ ] App description accurate
  - [ ] Screenshots don't show test data
  - [ ] No spam/misleading content
  - [ ] Not testing in production

- [ ] **Google Play Requirements**
  - [ ] Category selected
  - [ ] Content rating completed
  - [ ] Declared permissions accurate
  - [ ] No deceptive claims
  - [ ] Not testing in production

---

## Phase 8: User Experience Testing (Day 5)

### Usability

Have a tester (not familiar with code) try:

- [ ] **First Run**
  - [ ] Can complete onboarding
  - [ ] Can create first task
  - [ ] Can mark task complete
  - [ ] Can see progress

- [ ] **Common Tasks**
  - [ ] Intuitive to use
  - [ ] No confusing workflows
  - [ ] Help/info available if needed
  - [ ] Error messages helpful

- [ ] **Visual Design**
  - [ ] Professional appearance
  - [ ] Consistent branding
  - [ ] Good visual hierarchy
  - [ ] Appropriate whitespace

### Feedback

- [ ] Collect user feedback on:
  - [ ] Ease of use
  - [ ] Feature completeness
  - [ ] Visual appeal
  - [ ] Overall satisfaction

---

## Sign-Off Testing Checklist

Before submission, verify:

- [ ] All Phase 1-8 tests passed
- [ ] No critical bugs remaining
- [ ] Performance acceptable
- [ ] No data loss scenarios
- [ ] Privacy policy complete
- [ ] Terms of Service (if applicable)
- [ ] All features documented
- [ ] Screenshots prepared
- [ ] App icons finalized
- [ ] Metadata complete
- [ ] Certificates/signing configured
- [ ] Build tested (APK/AAB for Android, adhoc for iOS)
- [ ] Changelog prepared
- [ ] Version number correct
- [ ] No placeholder text remaining
- [ ] Analytics configured (optional)

---

## Bug Severity Ratings

| Severity | Definition | Action |
|----------|-----------|--------|
| **Critical** | App crashes, data loss, security breach | Fix before submission |
| **High** | Major feature broken, unusable state | Fix before submission |
| **Medium** | Feature partially broken, workaround exists | Fix or note in review |
| **Low** | Minor visual issue, edge case | Can defer to v1.0.1 |

---

## Testing Environment Checklist

Set up test account(s):

- [ ] Test Google account created
- [ ] Test data populated (5-10 tasks)
- [ ] Both iOS and Android test devices ready
- [ ] Latest iOS version on test iPhone
- [ ] Latest Android version on test phone
- [ ] WiFi connection stable
- [ ] 4G/LTE connection available
- [ ] Airplane mode tested
- [ ] No VPN interfering with testing

---

## Final Verification

Before hitting "Submit" button:

```
✓ Tested on at least 2 iOS devices
✓ Tested on at least 2 Android devices
✓ All critical functionality works
✓ No crashes in testing
✓ Performance acceptable
✓ Privacy/security verified
✓ Metadata complete and accurate
✓ Screenshots approved
✓ App icons included
✓ Version number correct
✓ Build signed and verified
```

---

**Estimated Time:** 3-5 business days

**Pro Tip:** Test on actual devices, not just simulators. Real devices catch issues that emulators miss.
