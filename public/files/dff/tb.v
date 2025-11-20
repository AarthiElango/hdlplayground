
`timescale 1ns/1ps

module tb_dff;

reg clk;
reg d;
reg rst;
wire q;

// Instantiate the DFF
dff uut (
    .clk(clk),
    .d(d),
    .rst(rst),
    .q(q)
);

// Clock generation: 10ns period
always #5 clk = ~clk;

initial begin
    // Create VCD file for waveform
    $dumpfile("dff.vcd");
    $dumpvars(0, tb_dff);

    // Initialize signals
    clk = 0;
    rst = 1;
    d   = 0;

    // Apply reset
    #10 rst = 0;

    // Apply stimulus
    #10 d = 1;
    #10 d = 0;
    #10 d = 1;

    // Apply reset again
    #10 rst = 1;
    #10 rst = 0;

    // More stimulus
    #10 d = 0;
    #10 d = 1;

    // End simulation
    #20 $finish;
end

initial begin
    $monitor("Time=%0t | clk=%b rst=%b d=%b q=%b", 
              $time, clk, rst, d, q);
end

endmodule
