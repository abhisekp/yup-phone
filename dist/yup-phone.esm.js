import{parsePhoneNumberWithError,isValidNumberForRegion}from'libphonenumber-js';import * as Yup from'yup';Yup.addMethod(Yup.string,"phone",function(a,c,b){void 0===c&&(c=!1);void 0===b&&(b="");return this.test("phone","string"===typeof b&&b?b:a?"${path} must be a valid phone number for region "+a:"${path} must be a valid phone number.",function(d){try{var e=parsePhoneNumberWithError(d,a);return e.isPossible()?c&&a?isValidNumberForRegion(d,a):e.isValid():!1}catch(f){return!1}})})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieXVwLXBob25lLmVzbS5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL3l1cC1waG9uZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBZdXAgZnJvbSBcInl1cFwiO1xuaW1wb3J0IHtcbiAgaXNWYWxpZE51bWJlckZvclJlZ2lvbixcbiAgQ291bnRyeUNvZGUsXG4gIHBhcnNlUGhvbmVOdW1iZXJXaXRoRXJyb3IsXG59IGZyb20gXCJsaWJwaG9uZW51bWJlci1qc1wiO1xuXG5kZWNsYXJlIG1vZHVsZSBcInl1cFwiIHtcbiAgZXhwb3J0IGludGVyZmFjZSBTdHJpbmdTY2hlbWEge1xuICAgIC8qKlxuICAgICAqIENoZWNrIGZvciBwaG9uZSBudW1iZXIgdmFsaWRpdHkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0NvdW50cnlDb2RlfSBbY291bnRyeUNvZGVdIFRoZSBjb3VudHJ5IGNvZGUgdG8gY2hlY2sgYWdhaW5zdC5cbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtzdHJpY3Q9ZmFsc2VdIEhvdyBzdHJpY3RseSBzaG91bGQgaXQgY2hlY2suXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IFtlcnJvck1lc3NhZ2U9REVGQVVMVF9NRVNTQUdFXSBUaGUgZXJyb3IgbWVzc2FnZSB0byByZXR1cm4gaWYgdGhlIHZhbGlkYXRpb24gZmFpbHMuXG4gICAgICovXG4gICAgcGhvbmUoXG4gICAgICBjb3VudHJ5Q29kZT86IENvdW50cnlDb2RlLFxuICAgICAgc3RyaWN0PzogYm9vbGVhbixcbiAgICAgIGVycm9yTWVzc2FnZT86IHN0cmluZ1xuICAgICk6IFN0cmluZ1NjaGVtYTtcbiAgfVxufVxuXG5jb25zdCBZVVBfUEhPTkVfTUVUSE9EID0gXCJwaG9uZVwiO1xuXG5ZdXAuYWRkTWV0aG9kKFxuICBZdXAuc3RyaW5nLFxuICBZVVBfUEhPTkVfTUVUSE9ELFxuICBmdW5jdGlvbiB5dXBQaG9uZShcbiAgICBjb3VudHJ5Q29kZT86IENvdW50cnlDb2RlLFxuICAgIHN0cmljdDogYm9vbGVhbiA9IGZhbHNlLFxuICAgIGVycm9yTWVzc2FnZTogc3RyaW5nID0gXCJcIlxuICApIHtcbiAgICBjb25zdCBlcnJNc2cgPVxuICAgICAgdHlwZW9mIGVycm9yTWVzc2FnZSA9PT0gXCJzdHJpbmdcIiAmJiBlcnJvck1lc3NhZ2VcbiAgICAgICAgPyBlcnJvck1lc3NhZ2VcbiAgICAgICAgOiBjb3VudHJ5Q29kZVxuICAgICAgICA/IGBcXCR7cGF0aH0gbXVzdCBiZSBhIHZhbGlkIHBob25lIG51bWJlciBmb3IgcmVnaW9uICR7Y291bnRyeUNvZGV9YFxuICAgICAgICA6IFwiJHtwYXRofSBtdXN0IGJlIGEgdmFsaWQgcGhvbmUgbnVtYmVyLlwiO1xuXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHJldHVybiB0aGlzLnRlc3QoWVVQX1BIT05FX01FVEhPRCwgZXJyTXNnLCAodmFsdWU6IHN0cmluZykgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcGhvbmVOdW1iZXIgPSBwYXJzZVBob25lTnVtYmVyV2l0aEVycm9yKHZhbHVlLCBjb3VudHJ5Q29kZSk7XG5cbiAgICAgICAgaWYgKCFwaG9uZU51bWJlci5pc1Bvc3NpYmxlKCkpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvKiBjaGVjayBpZiB0aGUgY291bnRyeUNvZGUgcHJvdmlkZWQgc2hvdWxkIGJlIHVzZWQgYXNcbiAgICAgICAgICBkZWZhdWx0IGNvdW50cnkgY29kZSBvciBzdHJpY3RseSBmb2xsb3dlZFxuICAgICAgICAqL1xuICAgICAgICBpZiAoc3RyaWN0ICYmIGNvdW50cnlDb2RlKSB7XG4gICAgICAgICAgcmV0dXJuIGlzVmFsaWROdW1iZXJGb3JSZWdpb24odmFsdWUsIGNvdW50cnlDb2RlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwaG9uZU51bWJlci5pc1ZhbGlkKCk7XG4gICAgICB9IGNhdGNoIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4pO1xuIl0sIm5hbWVzIjpbIll1cCIsImFkZE1ldGhvZCIsInN0cmluZyIsIllVUF9QSE9ORV9NRVRIT0QiLCJ5dXBQaG9uZSIsImNvdW50cnlDb2RlIiwic3RyaWN0IiwiZXJyb3JNZXNzYWdlIiwidGVzdCIsImVyck1zZyIsInZhbHVlIiwicGhvbmVOdW1iZXIiLCJwYXJzZVBob25lTnVtYmVyV2l0aEVycm9yIiwiaXNQb3NzaWJsZSIsImlzVmFsaWROdW1iZXJGb3JSZWdpb24iLCJpc1ZhbGlkIl0sIm1hcHBpbmdzIjoiYUEwQkFBLEdBQUlDLENBQUFBLFNBQUosQ0FDRUQsR0FBSUUsQ0FBQUEsTUFETixDQUZ5QkMsT0FFekIsQ0FHRUMsUUFBQSxDQUNFQyxDQURGLENBRUVDLENBRkYsQ0FHRUMsQ0FIRixDQUcyQixVQUR6QkQsSUFBQUEsRUFBa0IsQ0FBQSxZQUNsQkMsSUFBQUEsRUFBdUIsVUFVaEIsS0FBS0MsQ0FBQUEsSUFBTCxDQWxCY0wsT0FrQmQsQ0FQbUIsUUFBeEJNLEdBQUEsTUFBT0YsRUFBUEUsRUFBb0NGLENBQXBDRSxDQUNJRixDQURKRSxDQUVJSixDQUFBLG1EQUFBLENBQ29EQSxDQURwRCxDQUVBLHVDQUdDLENBQW9DLFNBQUNLLEVBQWlCLElBQ3ZELEtBQ0lDLEVBQWNDLHlCQUFBLENBQTBCRixDQUExQixDQUFpQ0wsQ0FBakMsUUFFZk0sRUFBWUUsQ0FBQUEsVUFBWixHQU9EUCxHQUFVRCxFQUNMUyxzQkFBQSxDQUF1QkosQ0FBdkIsQ0FBOEJMLENBQTlCLEVBR0ZNLENBQVlJLENBQUFBLE9BQVosR0FWRSxDQUFBLENBSlAsQ0FlRixPQUFBLENBQU0sT0FDQyxDQUFBLENBREQsQ0FoQm1ELENBQXRELENBVmtCLENBTjdCOyJ9
