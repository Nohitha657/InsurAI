package loopingprograms;

import java.util.Scanner;

public class LoopingExample3 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int number;

        do {
            System.out.print("Enter a positive number (0 to stop): ");
            number = sc.nextInt();

            if (number > 0) {
                System.out.println("You entered: " + number);
            }

        } while (number != 0);

        System.out.println("Loop exited. Program finished.");
        sc.close();
    }
}

