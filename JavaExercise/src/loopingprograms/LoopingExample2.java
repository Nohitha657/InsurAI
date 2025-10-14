package loopingprograms;

public class LoopingExample2 {
    public static void main(String[] args) {
        int i = 1;
        int sum = 0;

        System.out.println("Sum of first 5 natural numbers using while loop:");

        while (i <= 5) {
            sum += i;
            i++;
        }

        System.out.println("Sum = " + sum);
    }
}

