export class UserIdValidator {
  static extractAndValidateUserId(url: string): { isValid: boolean; userId?: string; error?: string } {
    try {
      const urlObject = new URL(url);
      const pathParts = urlObject.pathname.split('/');
      const userId = pathParts[pathParts.length - 1];

      if (!userId) {
        return {
          isValid: false,
          error: 'User ID is required',
        };
      }

      const userIdNumber = parseInt(userId, 10);
      
      if (isNaN(userIdNumber)) {
        return {
          isValid: false,
          error: 'Invalid user ID format',
        };
      }

      if (userIdNumber <= 0) {
        return {
          isValid: false,
          error: 'User ID must be a positive number',
        };
      }

      return {
        isValid: true,
        userId,
      };
    } catch (error) {
      return {
        isValid: false,
        error: 'Failed to parse URL',
      };
    }
  }
}