// Simple authentication for testing (không cần database)

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Check credentials (hardcoded cho test)
    if (email === "user@nextmail.com" && password === "123456") {
      // Redirect to dashboard
      return { success: true, message: "Login successful!" };
    } else {
      return { success: false, message: "Invalid email or password." };
    }
  } catch (error) {
    return { success: false, message: "Something went wrong." };
  }
}
