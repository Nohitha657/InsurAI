package conditionalprograms;

public class ConditionalExample2 {
    public static void main(String[] args) {
        int number = 0;

        System.out.println("Number: " + number);

        if (number > 0) {
            System.out.println("It is a Positive Number");
        } else if (number < 0) {
            System.out.println("It is a Negative Number");
        } else {
            System.out.println("It is Zero");
        }
    }
}
