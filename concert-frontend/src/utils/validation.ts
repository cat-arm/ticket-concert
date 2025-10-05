export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export const validateConcertForm = (data: { name: string; description: string; totalSeats: number }): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push({
      field: "name",
      message: "Concert name is required",
    });
  } else if (data.name.trim().length < 3) {
    errors.push({
      field: "name",
      message: "Concert name must be at least 3 characters",
    });
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.push({
      field: "description",
      message: "Description is required",
    });
  } else if (data.description.trim().length < 10) {
    errors.push({
      field: "description",
      message: "Description must be at least 10 characters",
    });
  }

  if (!data.totalSeats || data.totalSeats < 1) {
    errors.push({
      field: "totalSeats",
      message: "Total seats must be at least 1",
    });
  } else if (data.totalSeats > 10000) {
    errors.push({
      field: "totalSeats",
      message: "Total seats cannot exceed 10,000",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateReservation = (data: { userId: string; concertId: string }): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!data.userId || data.userId.trim().length === 0) {
    errors.push({
      field: "userId",
      message: "User ID is required",
    });
  }

  if (!data.concertId || data.concertId.trim().length === 0) {
    errors.push({
      field: "concertId",
      message: "Concert ID is required",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
