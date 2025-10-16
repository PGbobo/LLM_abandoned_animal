import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class loginform extends JFrame {
    private JTextField idField;
    private JPasswordField pwField;
    private JButton loginButton;
    private JLabel resultLabel;

    public loginform() {
        setTitle("이어주개 - 로그인");
        setSize(350, 250);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        // 레이아웃 생성
        JPanel panel = new JPanel();
        panel.setLayout(new GridBagLayout());
        panel.setBackground(Color.WHITE);

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(12, 12, 6, 12);
        gbc.anchor = GridBagConstraints.WEST;

        // ID 입력 필드
        gbc.gridx = 0;
        gbc.gridy = 0;
        panel.add(new JLabel("아이디:"), gbc);

        idField = new JTextField(18);
        gbc.gridx = 1;
        panel.add(idField, gbc);

        // PW 입력 필드
        gbc.gridx = 0;
        gbc.gridy = 1;
        panel.add(new JLabel("비밀번호:"), gbc);

        pwField = new JPasswordField(18);
        gbc.gridx = 1;
        panel.add(pwField, gbc);

        // 로그인 버튼
        loginButton = new JButton("로그인");
        loginButton.setBackground(new Color(14, 165, 233)); // sky-500 approx
        loginButton.setForeground(Color.WHITE);
        loginButton.setFocusPainted(false);
        gbc.gridx = 0;
        gbc.gridy = 2;
        gbc.gridwidth = 2;
        gbc.anchor = GridBagConstraints.CENTER;
        gbc.insets = new Insets(16, 12, 8, 12);
        panel.add(loginButton, gbc);

        // 결과 라벨
        resultLabel = new JLabel(" ");
        resultLabel.setHorizontalAlignment(SwingConstants.CENTER);
        resultLabel.setForeground(Color.RED);
        gbc.gridy = 3;
        panel.add(resultLabel, gbc);

        add(panel);

        // 이벤트 핸들러
        loginButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                handleLogin();
            }
        });

        // 엔터키로 로그인
        pwField.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                handleLogin();
            }
        });
    }

    private void handleLogin() {
        String id = idField.getText();
        String pw = new String(pwField.getPassword());

        // 테스트용 계정 id: testuser, pw: 1234
        if (id.equals("testuser") && pw.equals("1234")) {
            resultLabel.setForeground(new Color(34,197,94)); // green-500 approx
            resultLabel.setText("로그인 성공! 환영합니다.");
            JOptionPane.showMessageDialog(this, "로그인 성공! 이어주개에 오신 걸 환영합니다.", "로그인", JOptionPane.INFORMATION_MESSAGE);
        } else {
            resultLabel.setForeground(Color.RED);
            resultLabel.setText("아이디 또는 비밀번호가 올바르지 않습니다.");
        }
    }

    // 실행 코드 (테스트용)
    public static void main(String[] args) {
        SwingUtilities.invokeLater(new Runnable() {
            public void run() {
                new loginform().setVisible(true);
            }
        });
    }
}

