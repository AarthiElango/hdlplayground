module tb_blink;
  reg clk = 0;
  reg rst = 1;
  wire [3:0] led;

  blink dut (
    .clk(clk),
    .rst(rst),
    .led(led)
  );

  always #5 clk = ~clk;

  initial begin
    $dumpfile("dump.vcd");
    $dumpvars(0, tb_blink);

    rst = 1;
    #20;
    rst = 0;
    #200;
    $finish;
  end
endmodule