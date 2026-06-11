# Firebase Security Specification

## Data Invariants
1. Users can only read/write their own profile.
2. Users can only read/write to their own subcollection of coaching history, indexed by their userId.

## The "Dirty Dozen" Payloads (Examples)
1. Write to /users/differentUserId - Fail
2. Write to /users/myUserId/coaching_history/anotherHistoryId - Success (should be constrained)
3. Set field `role` on /users/myUserId - Fail
4. Set field `streak` as string on /users/myUserId - Fail

## Test Runner (firestore.rules.test.ts placeholder)
We will create firestore.rules and verify.
